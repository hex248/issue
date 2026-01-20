import type { TimerState } from "@sprint/shared";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useEndTimer, useTimerState, useToggleTimer } from "@/lib/query/hooks";
import { parseError } from "@/lib/server";
import { cn, formatTime } from "@/lib/utils";

export function IssueTimer({ issueId, onEnd }: { issueId: number; onEnd?: (data: TimerState) => void }) {
    const { data: timerState, error } = useTimerState(issueId);
    const toggleTimer = useToggleTimer();
    const endTimer = useEndTimer();
    const [displayTime, setDisplayTime] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (timerState) {
            setDisplayTime(timerState.workTimeMs);
        }
    }, [timerState]);

    useEffect(() => {
        if (!timerState?.isRunning) return;

        const startTime = Date.now();
        const baseTime = timerState.workTimeMs;

        const interval = setInterval(() => {
            setDisplayTime(baseTime + (Date.now() - startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [timerState?.isRunning, timerState?.workTimeMs]);

    useEffect(() => {
        if (!error) return;
        setErrorMessage(parseError(error as Error));
    }, [error]);

    const handleToggle = async () => {
        try {
            const data = await toggleTimer.mutateAsync({ issueId });
            if (data) {
                setDisplayTime(data.workTimeMs);
            }
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage(parseError(err as Error));
        }
    };

    const handleEnd = async () => {
        try {
            const data = await endTimer.mutateAsync({ issueId });
            if (data) {
                setDisplayTime(data.workTimeMs);
                onEnd?.(data);
            }
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage(parseError(err as Error));
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className={cn("text-6xl", !timerState?.isRunning && "text-muted-foreground")}>
                {formatTime(displayTime)}
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div className="flex gap-4">
                <Button onClick={handleToggle}>
                    {!timerState ? "Start" : timerState.isRunning ? "Pause" : "Resume"}
                </Button>
                <Button
                    onClick={handleEnd}
                    variant="outline"
                    disabled={!timerState || timerState.endedAt != null}
                >
                    End
                </Button>
            </div>
        </div>
    );
}
