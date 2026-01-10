import { getCsrfToken, getServerURL } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function update({
    organisationId,
    name,
    description,
    slug,
    statuses,
    onSuccess,
    onError,
}: {
    organisationId: number;
    name?: string;
    description?: string;
    slug?: string;
    statuses?: Record<string, string>;
} & ServerQueryInput) {
    const url = new URL(`${getServerURL()}/organisation/update`);
    url.searchParams.set("id", `${organisationId}`);
    if (name !== undefined) url.searchParams.set("name", name);
    if (description !== undefined) url.searchParams.set("description", description);
    if (slug !== undefined) url.searchParams.set("slug", slug);
    if (statuses !== undefined) {
        url.searchParams.set("statuses", JSON.stringify(statuses));
    }

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {};
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    const res = await fetch(url.toString(), {
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `failed to update organisation (${res.status})`);
    } else {
        const data = await res.json();
        onSuccess?.(data, res);
    }
}
