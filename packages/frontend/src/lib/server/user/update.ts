import type { UserRecord, UserUpdateRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function update(request: UserUpdateRequest): Promise<UserRecord> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/user/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to update user (${res.status})`);
    throw new Error(message);
  }

  const data = (await res.json()) as UserRecord;
  if (!data.id) {
    throw new Error(`failed to update user (${res.status})`);
  }
  return data;
}
