import type { SprintCreateRequest, SprintRecord, SprintUpdateRequest } from "@sprint/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { sprint } from "@/lib/server";

export function useSprints(projectId?: number | null) {
  return useQuery<SprintRecord[]>({
    queryKey: queryKeys.sprints.byProject(projectId ?? 0),
    queryFn: () => sprint.byProject(projectId ?? 0),
    enabled: Boolean(projectId),
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();

  return useMutation<SprintRecord, Error, SprintCreateRequest>({
    mutationKey: ["sprints", "create"],
    mutationFn: sprint.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.byProject(variables.projectId) });
    },
  });
}

export function useUpdateSprint() {
  const queryClient = useQueryClient();

  return useMutation<SprintRecord, Error, SprintUpdateRequest>({
    mutationKey: ["sprints", "update"],
    mutationFn: sprint.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.all });
    },
  });
}

export function useDeleteSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["sprints", "delete"],
    mutationFn: sprint.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.all });
    },
  });
}
