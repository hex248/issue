import type { UserRecord } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function byUsername(username: string): Promise<UserRecord> {
    const url = new URL(`${getServerURL()}/user/by-username`);
    url.searchParams.set("username", username);

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to get user (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
