import type { BunRequest } from "bun";
import { getAllProjects } from "../../db/queries";

// /projects/all
export default async function projectsAll(req: BunRequest) {
    const projects = await getAllProjects();

    return Response.json(projects);
}
