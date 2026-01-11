import { getCsrfToken, getServerURL } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function remove({
    issueId,
    onSuccess,
    onError,
}: {
    issueId: number;
} & ServerQueryInput) {
    const url = new URL(`${getServerURL()}/issue/delete`);
    url.searchParams.set("id", `${issueId}`);

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {};
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    const res = await fetch(url.toString(), {
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `failed to delete issue (${res.status})`);
    } else {
        const data = await res.text();
        onSuccess?.(data, res);
    }
}
