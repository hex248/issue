import type { BunRequest } from "bun";
import { getProjectsByOwnerID, getUserById } from "../../db/queries";

// /projects/by-owner?ownerId=1
export default async function projectsByOwner(req: BunRequest) {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId");

    if (!ownerId) {
        return new Response("ownerId is required", { status: 400 });
    }

    const ownerIdNumber = Number(ownerId);
    if (!Number.isInteger(ownerIdNumber)) {
        return new Response("ownerId must be an integer", { status: 400 });
    }

    const owner = await getUserById(ownerIdNumber);
    if (!owner) {
        return new Response(`user with id ${ownerId} not found`, { status: 404 });
    }

    const projects = await getProjectsByOwnerID(owner.id);

    return Response.json(projects);
}
