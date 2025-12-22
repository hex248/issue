import type { BunRequest } from "bun";
import { getProjectsByCreatorID, getUserById } from "../../db/queries";

// /projects/by-creator?creatorId=1
export default async function projectsByCreator(req: BunRequest) {
    const url = new URL(req.url);
    const creatorId = url.searchParams.get("creatorId");

    if (!creatorId) {
        return new Response("creatorId is required", { status: 400 });
    }

    const creatorIdNumber = Number(creatorId);
    if (!Number.isInteger(creatorIdNumber)) {
        return new Response("creatorId must be an integer", { status: 400 });
    }

    const creator = await getUserById(creatorIdNumber);
    if (!creator) {
        return new Response(`user with id ${creatorId} not found`, { status: 404 });
    }

    const projects = await getProjectsByCreatorID(creator.id);

    return Response.json(projects);
}
