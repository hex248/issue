import type { BunRequest } from "bun";
import { createProject, getProjectByBlob, getUserById } from "../../db/queries";

// /project/create?blob=BLOB&name=Testing&creatorId=1&organisationId=1
export default async function projectCreate(req: BunRequest) {
    const url = new URL(req.url);
    const blob = url.searchParams.get("blob");
    const name = url.searchParams.get("name");
    const creatorId = url.searchParams.get("creatorId");
    const organisationId = url.searchParams.get("organisationId");

    if (!blob || !name || !creatorId || !organisationId) {
        return new Response(
            `missing parameters: ${!blob ? "blob " : ""}${!name ? "name " : ""}${!creatorId ? "creatorId " : ""}${!organisationId ? "organisationId" : ""}`,
            { status: 400 },
        );
    }

    // check if project with blob already exists
    const existingProject = await getProjectByBlob(blob);
    if (existingProject) {
        return new Response(`project with blob ${blob} already exists`, { status: 400 });
    }

    const creator = await getUserById(parseInt(creatorId, 10));
    if (!creator) {
        return new Response(`creator with id ${creatorId} not found`, { status: 404 });
    }

    const project = await createProject(blob, name, creator.id, parseInt(organisationId, 10));

    return Response.json(project);
}
