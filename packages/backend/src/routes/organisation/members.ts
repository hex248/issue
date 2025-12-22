import type { BunRequest } from "bun";
import { getOrganisationById, getOrganisationMembers } from "../../db/queries";

// /organisation/members?organisationId=1
export default async function organisationMembers(req: BunRequest) {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");

    if (!organisationId) {
        return new Response("organisationId is required", { status: 400 });
    }

    const orgIdNumber = Number(organisationId);
    if (!Number.isInteger(orgIdNumber)) {
        return new Response("organisationId must be an integer", { status: 400 });
    }

    const organisation = await getOrganisationById(orgIdNumber);
    if (!organisation) {
        return new Response(`organisation with id ${organisationId} not found`, { status: 404 });
    }

    const members = await getOrganisationMembers(orgIdNumber);

    return Response.json(members);
}
