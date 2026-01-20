import type { IssueResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byProject(projectId: number): Promise<IssueResponse[]> {
    const url = new URL(`${getServerURL()}/issues/by-project`);
    url.searchParams.set("projectId", `${projectId}`);

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to get issues by project (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
