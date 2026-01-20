import type { SuccessResponse } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function remove(issueId: number): Promise<SuccessResponse> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/issue/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({ id: issueId }),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to delete issue (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
