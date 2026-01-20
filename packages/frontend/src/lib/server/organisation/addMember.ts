import type { OrgAddMemberRequest, OrganisationMemberRecord } from "@sprint/shared";
import { getCsrfToken, getServerURL } from "@/lib/utils";
import { getErrorMessage } from "..";

export async function addMember(request: OrgAddMemberRequest): Promise<OrganisationMemberRecord> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${getServerURL()}/organisation/add-member`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(request),
        credentials: "include",
    });

    if (!res.ok) {
        const message = await getErrorMessage(res, `failed to add member (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}
