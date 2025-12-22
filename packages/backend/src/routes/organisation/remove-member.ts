import type { BunRequest } from "bun";
import { getOrganisationById, getUserById, removeOrganisationMember } from "../../db/queries";

// /organisation/remove-member?organisationId=1&userId=2
export default async function organisationRemoveMember(req: BunRequest) {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");
    const userId = url.searchParams.get("userId");

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

    await removeOrganisationMember(orgIdNumber, userIdNumber);

    return Response.json({ success: true });
}
