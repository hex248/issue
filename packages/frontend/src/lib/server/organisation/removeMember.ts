import type { OrgRemoveMemberRequest, SuccessResponse } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function removeMember(request: OrgRemoveMemberRequest): Promise<SuccessResponse> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/organisation/remove-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to remove member (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
