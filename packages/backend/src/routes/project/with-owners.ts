import type { BunRequest } from "bun";
import { getProjectsWithOwners } from "../../db/queries";

// /projects/with-owners
export default async function projectsWithOwners(req: BunRequest) {
    const projects = await getProjectsWithOwners();

    return Response.json(projects);
}
