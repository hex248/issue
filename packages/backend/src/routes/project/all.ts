import type { BunRequest } from "bun";
import { getProjectsWithOwners } from "../../db/queries";

// /projects/all
export default async function projectsAll(req: BunRequest) {
    const projects = await getProjectsWithOwners();

    return Response.json(projects);
}
