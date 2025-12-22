import type { BunRequest } from "bun";
import { createOrganisationMember, getOrganisationById, getUserById } from "../../db/queries";

// /organisation/add-member?organisationId=1&userId=2&role=member
export default async function organisationAddMember(req: BunRequest) {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");
    const userId = url.searchParams.get("userId");
    const role = url.searchParams.get("role") || "member";

    if (!organisationId || !userId) {
        return new Response(
            `missing parameters: ${!organisationId ? "organisationId " : ""}${!userId ? "userId" : ""}`,
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

    const member = await createOrganisationMember(orgIdNumber, userIdNumber, role);

    return Response.json(member);
}
