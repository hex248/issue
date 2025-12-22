import type { BunRequest } from "bun";
import { getOrganisationsByUserId, getUserById } from "../../db/queries";

// /organisation/by-user?userId=1
export default async function organisationsByUser(req: BunRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return new Response("userId is required", { status: 400 });
    }

    const userIdNumber = Number(userId);
    if (!Number.isInteger(userIdNumber)) {
        return new Response("userId must be an integer", { status: 400 });
    }

    const user = await getUserById(userIdNumber);
    if (!user) {
        return new Response(`user with id ${userId} not found`, { status: 404 });
    }

    const organisations = await getOrganisationsByUserId(user.id);

    return Response.json(organisations);
}
