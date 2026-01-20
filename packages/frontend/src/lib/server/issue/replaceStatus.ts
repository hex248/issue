import type { IssuesReplaceStatusRequest, ReplaceStatusResponse } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function replaceStatus(request: IssuesReplaceStatusRequest): Promise<ReplaceStatusResponse> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/issues/replace-status`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to replace status (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
