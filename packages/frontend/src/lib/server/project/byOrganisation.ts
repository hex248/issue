import type { ProjectResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byOrganisation(organisationId: number): Promise<ProjectResponse[]> {
  const url = new URL(`${getServerURL()}/projects/by-organisation`);
  url.searchParams.set("organisationId", `${organisationId}`);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get projects by organisation (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
