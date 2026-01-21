import { IssueCreateRequestSchema } from "@sprint/shared";
import type { AuthedRequest } from "../../auth/middleware";
import { createIssue, getOrganisationMemberRole, getProjectByID } from "../../db/queries";
import { errorResponse, parseJsonBody } from "../../validation";

export default async function issueCreate(req: AuthedRequest) {
    const parsed = await parseJsonBody(req, IssueCreateRequestSchema);
    if ("error" in parsed) return parsed.error;

    const { projectId, title, description = "", status, assigneeIds, sprintId } = parsed.data;

    const project = await getProjectByID(projectId);
    if (!project) {
        return errorResponse(`project not found: ${projectId}`, "PROJECT_NOT_FOUND", 404);
    }

    const requesterMember = await getOrganisationMemberRole(project.organisationId, req.userId);
    if (!requesterMember) {
        return errorResponse("you are not a member of this organisation", "NOT_MEMBER", 403);
    }
    if (requesterMember.role !== "owner" && requesterMember.role !== "admin") {
        return errorResponse(
            "only organisation owners and admins can create issues",
            "PERMISSION_DENIED",
            403,
        );
    }

    const issue = await createIssue(
        project.id,
        title,
        description,
        req.userId,
        sprintId ?? undefined,
        assigneeIds,
        status,
    );

    return Response.json(issue);
}
