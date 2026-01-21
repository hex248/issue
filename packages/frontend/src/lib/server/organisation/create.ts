import type { OrganisationRecord, OrgCreateRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function create(request: OrgCreateRequest): Promise<OrganisationRecord> {
  const csrfToken = getCsrfToken();

  const res = await fetch(`${getServerURL()}/organisation/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to create organisation (${res.status})`);
    throw new Error(message);
  }

  const data = (await res.json()) as OrganisationRecord;
  if (!data.id) {
    throw new Error(`failed to create organisation (${res.status})`);
  }
  return data;
}
