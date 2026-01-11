import type { AuthedRequest } from "../../auth/middleware";
import { getIssueStatusCountByOrganisation, getOrganisationMemberRole } from "../../db/queries";

// /issues/status-count?organisationId=1&status=TODO
export default async function issuesStatusCount(req: AuthedRequest) {
    const url = new URL(req.url);
    const organisationIdParam = url.searchParams.get("organisationId");
    const status = url.searchParams.get("status");

    if (!organisationIdParam) {
        return new Response("missing organisationId", { status: 400 });
    }

    if (!status) {
        return new Response("missing status", { status: 400 });
    }

    const organisationId = Number(organisationIdParam);
    if (!Number.isInteger(organisationId)) {
        return new Response("organisationId must be an integer", { status: 400 });
    }

    const membership = await getOrganisationMemberRole(organisationId, req.userId);
    if (!membership) {
        return new Response("not a member of this organisation", { status: 403 });
    }

    const result = await getIssueStatusCountByOrganisation(organisationId, status);

    return Response.json(result);
}
