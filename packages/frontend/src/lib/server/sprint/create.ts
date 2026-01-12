import { getCsrfToken, getServerURL } from "@/lib/utils";
import type { ServerQueryInput } from "..";

export async function create({
    projectId,
    name,
    color,
    startDate,
    endDate,
    onSuccess,
    onError,
}: {
    projectId: number;
    name: string;
    color: string;
    startDate: Date;
    endDate: Date;
} & ServerQueryInput) {
    const url = new URL(`${getServerURL()}/sprint/create`);
    url.searchParams.set("projectId", `${projectId}`);
    url.searchParams.set("name", name.trim());
    url.searchParams.set("color", color);
    url.searchParams.set("startDate", startDate.toISOString());
    url.searchParams.set("endDate", endDate.toISOString());

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {};
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    const res = await fetch(url.toString(), {
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.text();
        onError?.(error || `failed to create sprint (${res.status})`);
    } else {
        const data = await res.json();
        if (!data.id) {
            onError?.(`failed to create sprint (${res.status})`);
            return;
        }

        onSuccess?.(data, res);
    }
}
