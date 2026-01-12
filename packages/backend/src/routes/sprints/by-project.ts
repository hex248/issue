import type { AuthedRequest } from "../../auth/middleware";
import { getOrganisationMemberRole, getProjectByID, getSprintsByProject } from "../../db/queries";

// /sprints/by-project?projectId=1
export default async function sprintsByProject(req: AuthedRequest) {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
        return new Response("missing projectId", { status: 400 });
    }

    const projectIdNumber = Number(projectId);
    if (!Number.isInteger(projectIdNumber)) {
        return new Response("projectId must be an integer", { status: 400 });
    }

    const project = await getProjectByID(projectIdNumber);
    if (!project) {
        return new Response(`project not found: provided ${projectId}`, { status: 404 });
    }

    const membership = await getOrganisationMemberRole(project.organisationId, req.userId);
    if (!membership) {
        return new Response("not a member of this organisation", { status: 403 });
    }

    const sprints = await getSprintsByProject(project.id);

    return Response.json(sprints);
}
