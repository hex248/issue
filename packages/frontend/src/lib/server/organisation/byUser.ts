import type { OrganisationResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byUser(): Promise<OrganisationResponse[]> {
  const res = await fetch(`${getServerURL()}/organisations/by-user`, {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get organisations (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
