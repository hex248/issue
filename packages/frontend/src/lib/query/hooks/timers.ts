import type { TimerEndRequest, TimerState, TimerToggleRequest } from "@sprint/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { timer } from "@/lib/server";

export function useTimerState(issueId?: number | null, options?: { refetchInterval?: number }) {
    return useQuery<TimerState>({
        queryKey: queryKeys.timers.active(issueId ?? 0),
        queryFn: () => timer.get(issueId ?? 0),
        enabled: Boolean(issueId),
        refetchInterval: options?.refetchInterval,
        refetchIntervalInBackground: false,
    });
}

export function useInactiveTimers(issueId?: number | null, options?: { refetchInterval?: number }) {
    return useQuery<TimerState[]>({
        queryKey: queryKeys.timers.inactive(issueId ?? 0),
        queryFn: () => timer.getInactive(issueId ?? 0),
        enabled: Boolean(issueId),
        refetchInterval: options?.refetchInterval,
        refetchIntervalInBackground: false,
    });
}

export function useToggleTimer() {
    const queryClient = useQueryClient();

    return useMutation<TimerState, Error, TimerToggleRequest>({
        mutationKey: ["timers", "toggle"],
        mutationFn: timer.toggle,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(queryKeys.timers.active(variables.issueId), data);
            queryClient.invalidateQueries({ queryKey: queryKeys.timers.inactive(variables.issueId) });
        },
    });
}

export function useEndTimer() {
    const queryClient = useQueryClient();

    return useMutation<TimerState, Error, TimerEndRequest>({
        mutationKey: ["timers", "end"],
        mutationFn: timer.end,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(queryKeys.timers.active(variables.issueId), data);
            queryClient.invalidateQueries({ queryKey: queryKeys.timers.inactive(variables.issueId) });
        },
    });
}
