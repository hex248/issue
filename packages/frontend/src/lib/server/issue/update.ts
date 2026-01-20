import type { IssueRecord, IssueUpdateRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function update(input: IssueUpdateRequest): Promise<IssueRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/issue/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(input),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to update issue (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
