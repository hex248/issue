import type { BunRequest } from "bun";
import { getProjectWithCreatorByID } from "../../db/queries";

// /project/with-creator?id=1
export default async function projectWithCreatorByID(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response("project id is required", { status: 400 });
    }

    const projectId = Number(id);
    if (!Number.isInteger(projectId)) {
        return new Response("project id must be an integer", { status: 400 });
    }

    const projectWithCreator = await getProjectWithCreatorByID(projectId);
    if (!projectWithCreator || !projectWithCreator.Project) {
        return new Response(`project with id ${id} not found`, { status: 404 });
    }

    return Response.json(projectWithCreator);
}
