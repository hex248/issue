import type { TimerState } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function get(issueId: number): Promise<TimerState> {
    const url = new URL(`${getServerURL()}/timer/get`);
    url.searchParams.set("issueId", `${issueId}`);

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to get timer (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
