import { getServerURL } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function statusCount({
    organisationId,
    status,
    onSuccess,
    onError,
}: {
    organisationId: number;
    status: string;
} & ServerQueryInput) {
    const url = new URL(`${getServerURL()}/issues/status-count`);
    url.searchParams.set("organisationId", `${organisationId}`);
    url.searchParams.set("status", status);

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `failed to get issue status count (${res.status})`);
    } else {
        const data = await res.json();
        onSuccess?.(data, res);
    }
}
