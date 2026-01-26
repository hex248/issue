import type { TimerEndRequest, TimerListItem, TimerState, TimerToggleRequest } from "@sprint/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { timer } from "@/lib/server";

const activeTimersQueryFn = () => timer.list({ activeOnly: true });

export function useActiveTimers(options?: { refetchInterval?: number; enabled?: boolean }) {
  return useQuery<TimerListItem[]>({
    queryKey: queryKeys.timers.list(),
    queryFn: activeTimersQueryFn,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    refetchIntervalInBackground: false,
  });
}

export function useTimerState(issueId?: number | null, options?: { refetchInterval?: number }) {
  return useQuery<TimerListItem[], Error, TimerState>({
    queryKey: queryKeys.timers.list(),
    queryFn: activeTimersQueryFn,
    enabled: Boolean(issueId),
    refetchInterval: options?.refetchInterval,
    refetchIntervalInBackground: false,
    select: (timers) => timers.find((timer) => timer.issueId === issueId) ?? null,
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timers.inactive(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timers.list() });
    },
  });
}

export function useEndTimer() {
  const queryClient = useQueryClient();

  return useMutation<TimerState, Error, TimerEndRequest>({
    mutationKey: ["timers", "end"],
    mutationFn: timer.end,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timers.inactive(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timers.list() });
    },
  });
}
