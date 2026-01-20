import type { SprintCreateRequest, SprintRecord } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function create(input: SprintCreateRequest): Promise<SprintRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/sprint/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
            ...input,
            name: input.name.trim(),
        }),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to create sprint (${res.status})`);
        throw new Error(message);
    }

    const data = (await res.json()) as SprintRecord;
    if (!data.id) {
        throw new Error(`failed to create sprint (${res.status})`);
    }
    return data;
}
