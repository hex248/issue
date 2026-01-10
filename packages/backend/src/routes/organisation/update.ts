import { ISSUE_STATUS_MAX_LENGTH } from "@issue/shared";
import type { BunRequest } from "bun";
import { getOrganisationById, updateOrganisation } from "../../db/queries";

// /organisation/update?id=1&name=New%20Name&description=New%20Description&slug=new-slug
export default async function organisationUpdate(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name") || undefined;
    const description = url.searchParams.get("description") || undefined;
    const slug = url.searchParams.get("slug") || undefined;
    const statusesParam = url.searchParams.get("statuses");

    let statuses: Record<string, string> | undefined;
    if (statusesParam) {
        try {
            const parsed = JSON.parse(statusesParam);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                return new Response("statuses must be an object", { status: 400 });
            }
            const entries = Object.entries(parsed);
            if (entries.length === 0) {
                return new Response("statuses must have at least one status", { status: 400 });
            }
            if (!entries.every(([key, value]) => typeof key === "string" && typeof value === "string")) {
                return new Response("statuses values must be strings", { status: 400 });
            }
            if (entries.some(([key]) => key.length > ISSUE_STATUS_MAX_LENGTH)) {
                return new Response(`status must be <= ${ISSUE_STATUS_MAX_LENGTH} characters`, {
                    status: 400,
                });
            }
            statuses = parsed;
        } catch {
            return new Response("invalid statuses format (must be JSON object)", { status: 400 });
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
