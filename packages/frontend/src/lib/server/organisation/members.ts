import type { OrganisationMemberResponse } from "@sprint/shared";
import { getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function members(organisationId: number): Promise<OrganisationMemberResponse[]> {
    const url = new URL(`${getServerURL()}/organisation/members`);
    url.searchParams.set("organisationId", `${organisationId}`);

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to get members (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
