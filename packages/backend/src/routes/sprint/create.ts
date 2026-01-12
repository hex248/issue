import type { AuthedRequest } from "../../auth/middleware";
import { createSprint, getOrganisationMemberRole, getProjectByID } from "../../db/queries";

// /sprint/create?projectId=1&name=Sprint%201&startDate=2025-01-01T00:00:00.000Z&endDate=2025-01-14T23:59:00.000Z
export default async function sprintCreate(req: AuthedRequest) {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");
    const name = url.searchParams.get("name");
    const color = url.searchParams.get("color") || undefined;
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    if (!projectId || !name || !startDateParam || !endDateParam) {
        return new Response(
            `missing parameters: ${!projectId ? "projectId " : ""}${!name ? "name " : ""}${
                !startDateParam ? "startDate " : ""
            }${!endDateParam ? "endDate" : ""}`,
            { status: 400 },
        );
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

    if (membership.role !== "owner" && membership.role !== "admin") {
        return new Response("only owners and admins can create sprints", { status: 403 });
    }

    const trimmedName = name.trim();
    if (trimmedName === "") {
        return new Response("name cannot be empty", { status: 400 });
    }

    const startDate = new Date(startDateParam);
    if (Number.isNaN(startDate.valueOf())) {
        return new Response("startDate must be a valid date", { status: 400 });
    }

    const endDate = new Date(endDateParam);
    if (Number.isNaN(endDate.valueOf())) {
        return new Response("endDate must be a valid date", { status: 400 });
    }

    if (startDate > endDate) {
        return new Response("endDate must be after startDate", { status: 400 });
    }

    const sprint = await createSprint(project.id, trimmedName, color, startDate, endDate);

    return Response.json(sprint);
}
