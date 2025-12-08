import type { BunRequest } from "bun";
import { getIssuesByProject, getProjectByBlob } from "../../db/queries";

export default async function issuesInProject(req: BunRequest<"/issues/:projectBlob">) {
    const { projectBlob } = req.params;

    const project = await getProjectByBlob(projectBlob);
    if (!project) {
        return new Response(`project not found: provided ${projectBlob}`, { status: 404 });
    }
    const issues = await getIssuesByProject(project.id);

    return Response.json(issues);
}
