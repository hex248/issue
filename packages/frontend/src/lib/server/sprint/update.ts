import type { SprintRecord, SprintUpdateRequest } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function update(input: SprintUpdateRequest): Promise<SprintRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/sprint/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
            ...input,
            name: input.name?.trim(),
        }),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to update sprint (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
