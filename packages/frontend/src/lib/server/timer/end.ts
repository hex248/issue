import type { TimerEndRequest, TimerState } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function end(request: TimerEndRequest): Promise<TimerState> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/timer/end`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to end timer (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
