import type { OrganisationRecord, OrgUpdateRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function update(input: OrgUpdateRequest): Promise<OrganisationRecord> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/organisation/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(input),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to update organisation (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
