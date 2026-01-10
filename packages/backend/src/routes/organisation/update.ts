import { ISSUE_STATUS_MAX_LENGTH } from "@issue/shared";
import type { BunRequest } from "bun";
import { getOrganisationById, updateOrganisation } from "../../db/queries";

// /organisation/update?id=1&name=New%20Name&description=New%20Description&slug=new-slug&statuses=["TO DO","IN PROGRESS"]
export default async function organisationUpdate(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name") || undefined;
    const description = url.searchParams.get("description") || undefined;
    const slug = url.searchParams.get("slug") || undefined;
    const statusesParam = url.searchParams.get("statuses");

    let statuses: string[] | undefined;
    if (statusesParam) {
        try {
            statuses = JSON.parse(statusesParam);
            if (!Array.isArray(statuses) || !statuses.every((s) => typeof s === "string")) {
                return new Response("statuses must be an array of strings", { status: 400 });
            }
            if (statuses.length === 0) {
                return new Response("statuses must have at least one status", { status: 400 });
            }

            if (statuses.some((s) => s.length > ISSUE_STATUS_MAX_LENGTH)) {
                return new Response(`status must be <= ${ISSUE_STATUS_MAX_LENGTH} characters`, {
                    status: 400,
                });
            }
        } catch {
            return new Response("invalid statuses format (must be JSON array)", { status: 400 });
        }
    }

    if (!id) {
        return new Response("organisation id is required", { status: 400 });
    }

    const organisationId = Number(id);
    if (!Number.isInteger(organisationId)) {
        return new Response("organisation id must be an integer", { status: 400 });
    }

    const existingOrganisation = await getOrganisationById(organisationId);
    if (!existingOrganisation) {
        return new Response(`organisation with id ${id} does not exist`, { status: 404 });
    }

    if (!name && !description && !slug && !statuses) {
        return new Response("at least one of name, description, slug, or statuses must be provided", {
            status: 400,
        });
    }

    const organisation = await updateOrganisation(organisationId, {
        name,
        description,
        slug,
        statuses,
    });

    return Response.json(organisation);
}
