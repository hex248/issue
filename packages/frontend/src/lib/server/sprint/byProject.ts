import type { SprintRecord } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byProject(projectId: number): Promise<SprintRecord[]> {
  const url = new URL(`${getServerURL()}/sprints/by-project`);
  url.searchParams.set("projectId", `${projectId}`);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, `failed to get sprints (${res.status})`);
    throw new Error(message);
  }

  return res.json();
}
