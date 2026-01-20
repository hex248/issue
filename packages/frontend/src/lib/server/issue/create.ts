import type { IssueCreateRequest, IssueRecord } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function create(request: IssueCreateRequest): Promise<IssueRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/issue/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to create issue (${res.status})`);
        throw new Error(message);
    }

    const data = (await res.json()) as IssueRecord;
    if (!data.id) {
        throw new Error(`failed to create issue (${res.status})`);
    }
    return data;
}
