import { getCsrfToken, getServerURL } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function replaceStatus({
    organisationId,
    oldStatus,
    newStatus,
    onSuccess,
    onError,
}: {
    organisationId: number;
    oldStatus: string;
    newStatus: string;
} & ServerQueryInput) {
    const url = new URL(`${getServerURL()}/issues/replace-status`);
    url.searchParams.set("organisationId", `${organisationId}`);
    url.searchParams.set("oldStatus", oldStatus);
    url.searchParams.set("newStatus", newStatus);

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {};
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    const res = await fetch(url.toString(), {
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `failed to replace status (${res.status})`);
    } else {
        const data = await res.json();
        onSuccess?.(data, res);
    }
}
