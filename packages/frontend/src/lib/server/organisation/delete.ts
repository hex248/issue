import type { SuccessResponse } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function remove(organisationId: number): Promise<SuccessResponse> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/organisation/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({ id: organisationId }),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to delete organisation (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
