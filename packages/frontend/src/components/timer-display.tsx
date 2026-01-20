import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useInactiveTimers, useTimerState } from "@/lib/query/hooks";
import { parseError } from "@/lib/server";
import { formatTime } from "@/lib/utils";

const FALLBACK_TIME = "--:--:--";
const REFRESH_INTERVAL_MS = 10000;

export function TimerDisplay({ issueId }: { issueId: number }) {
    const { data: timerState, error: timerError } = useTimerState(issueId, {
        refetchInterval: REFRESH_INTERVAL_MS,
    });
    const { data: inactiveTimers = [], error: inactiveError } = useInactiveTimers(issueId, {
        refetchInterval: REFRESH_INTERVAL_MS,
    });

    const [workTimeMs, setWorkTimeMs] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const combinedError = timerError ?? inactiveError;

    useEffect(() => {
        if (combinedError) {
            const message = parseError(combinedError as Error);
            setError(message);
            toast.error(`Error fetching timer data: ${message}`, {
                dismissible: false,
            });
            return;
        }
        setError(null);
        setWorkTimeMs(timerState?.workTimeMs ?? 0);
    }, [combinedError, timerState]);

    useEffect(() => {
        if (!timerState?.isRunning) return;

        const startTime = Date.now();
        const baseWorkTime = timerState.workTimeMs;
        const interval = window.setInterval(() => {
            setWorkTimeMs(baseWorkTime + (Date.now() - startTime));
        }, 1000);

        return () => window.clearInterval(interval);
    }, [timerState?.isRunning, timerState?.workTimeMs]);

    const inactiveWorkTimeMs = useMemo(
        () => inactiveTimers.reduce((total, session) => total + (session?.workTimeMs ?? 0), 0),
        [inactiveTimers],
    );

    const totalWorkTimeMs = inactiveWorkTimeMs + workTimeMs;
    const displayWorkTime = error ? FALLBACK_TIME : formatTime(totalWorkTimeMs);

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono tabular-nums">{displayWorkTime}</span>
        </div>
    );
}
