import type { OrganisationMemberRecord, OrgUpdateMemberRoleRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function updateMemberRole(
  request: OrgUpdateMemberRoleRequest,
): Promise<OrganisationMemberRecord> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/organisation/update-member-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to update member role (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
