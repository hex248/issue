import type {
  ProjectCreateRequest,
  ProjectRecord,
  ProjectResponse,
  ProjectUpdateRequest,
} from "@sprint/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { project } from "@/lib/server";

export function useProjects(organisationId?: number | null) {
  return useQuery<ProjectResponse[]>({
    queryKey: queryKeys.projects.byOrganisation(organisationId ?? 0),
    queryFn: () => project.byOrganisation(organisationId ?? 0),
    enabled: Boolean(organisationId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<ProjectRecord, Error, ProjectCreateRequest>({
    mutationKey: ["projects", "create"],
    mutationFn: project.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.byOrganisation(variables.organisationId),
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation<ProjectRecord, Error, ProjectUpdateRequest>({
    mutationKey: ["projects", "update"],
    mutationFn: project.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["projects", "delete"],
    mutationFn: project.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}
