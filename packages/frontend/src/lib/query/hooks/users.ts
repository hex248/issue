import type { UserRecord, UserUpdateRequest } from "@sprint/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { user } from "@/lib/server";

export function useUserByUsername(username?: string | null) {
  return useQuery<UserRecord>({
    queryKey: queryKeys.users.byUsername(username ?? ""),
    queryFn: () => user.byUsername(username ?? ""),
    enabled: Boolean(username),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<UserRecord, Error, UserUpdateRequest>({
    mutationKey: ["users", "update"],
    mutationFn: user.update,
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, File>({
    mutationKey: ["users", "upload-avatar"],
    mutationFn: user.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
