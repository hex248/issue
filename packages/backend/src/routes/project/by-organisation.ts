import type { AuthedRequest } from "../../auth/middleware";
import { getOrganisationById, getOrganisationsByUserId, getProjectsByOrganisationId } from "../../db/queries";

// /projects/by-organisation?organisationId=1
export default async function projectsByOrganisation(req: AuthedRequest) {
    const url = new URL(req.url);
    const organisationId = url.searchParams.get("organisationId");

    if (!organisationId) {
        return new Response("organisationId is required", { status: 400 });
    }

    const orgIdNumber = Number(organisationId);
    if (!Number.isInteger(orgIdNumber)) {
        return new Response("organisationId must be an integer", { status: 400 });
    }

    const organisation = await getOrganisationById(orgIdNumber);
    if (!organisation) {
        return new Response(`organisation with id ${organisationId} not found`, { status: 404 });
    }

    // Check if user has access to this organisation
    const userOrganisations = await getOrganisationsByUserId(req.userId);
    const hasAccess = userOrganisations.some((item) => item.Organisation.id === orgIdNumber);
    if (!hasAccess) {
        return new Response("Access denied: you are not a member of this organisation", { status: 403 });
    }

    const projects = await getProjectsByOrganisationId(orgIdNumber);

    return Response.json(projects);
}
