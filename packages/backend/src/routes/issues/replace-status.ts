import type { AuthedRequest } from "../../auth/middleware";
import { getOrganisationMemberRole, replaceIssueStatus } from "../../db/queries";

// /issues/replace-status?organisationId=1&oldStatus=TO%20DO&newStatus=IN%20PROGRESS
export default async function issuesReplaceStatus(req: AuthedRequest) {
    const url = new URL(req.url);
    const organisationIdParam = url.searchParams.get("organisationId");
    const oldStatus = url.searchParams.get("oldStatus");
    const newStatus = url.searchParams.get("newStatus");

    if (!organisationIdParam) {
        return new Response("missing organisationId", { status: 400 });
    }

    if (!oldStatus) {
        return new Response("missing oldStatus", { status: 400 });
    }

    if (!newStatus) {
        return new Response("missing newStatus", { status: 400 });
    }

    const organisationId = Number(organisationIdParam);
    if (!Number.isInteger(organisationId)) {
        return new Response("organisationId must be an integer", { status: 400 });
    }

    // check if user is admin or owner of the organisation
    const membership = await getOrganisationMemberRole(organisationId, req.userId);
    if (!membership) {
        return new Response("not a member of this organisation", { status: 403 });
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
        return new Response("only admins and owners can replace statuses", { status: 403 });
    }

    const result = await replaceIssueStatus(organisationId, oldStatus, newStatus);

    return Response.json(result);
}
