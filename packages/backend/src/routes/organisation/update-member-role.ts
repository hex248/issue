import type { BunRequest } from "bun";
import { getOrganisationById, getUserById, updateOrganisationMemberRole } from "../../db/queries";

// /organisation/update-member-role?organisationId=1&userId=2&role=admin
export default async function organisationUpdateMemberRole(req: BunRequest) {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");
    const userId = url.searchParams.get("userId");
    const role = url.searchParams.get("role");

    if (!organisationId || !userId || !role) {
        return new Response(
            `missing parameters: ${!organisationId ? "organisationId " : ""}${!userId ? "userId " : ""}${!role ? "role" : ""}`,
            { status: 400 },
        );
    }

    const orgIdNumber = Number(organisationId);
    const userIdNumber = Number(userId);

    if (!Number.isInteger(orgIdNumber) || !Number.isInteger(userIdNumber)) {
        return new Response("organisationId and userId must be integers", { status: 400 });
    }

    const organisation = await getOrganisationById(orgIdNumber);
    if (!organisation) {
        return new Response(`organisation with id ${organisationId} not found`, { status: 404 });
    }

    const user = await getUserById(userIdNumber);
    if (!user) {
        return new Response(`user with id ${userId} not found`, { status: 404 });
    }

    const member = await updateOrganisationMemberRole(orgIdNumber, userIdNumber, role);

    return Response.json(member);
}
