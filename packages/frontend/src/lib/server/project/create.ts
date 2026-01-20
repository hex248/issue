import type { ProjectCreateRequest, ProjectRecord } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function create(request: ProjectCreateRequest): Promise<ProjectRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/project/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to create project (${res.status})`);
        throw new Error(message);
    }

    const data = (await res.json()) as ProjectRecord;
    if (!data.id) {
        throw new Error(`failed to create project (${res.status})`);
    }
    return data;
}
