import type { StatusCountResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function statusCount(organisationId: number, status: string): Promise<StatusCountResponse> {
  const url = new URL(`${getServerURL()}/issues/status-count`);
  url.searchParams.set("organisationId", `${organisationId}`);
  url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get issue status count (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
