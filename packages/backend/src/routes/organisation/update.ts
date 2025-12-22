import type { BunRequest } from "bun";
import { getOrganisationById, updateOrganisation } from "../../db/queries";

// /organisation/update?id=1&name=New%20Name&description=New%20Description&slug=new-slug
export default async function organisationUpdate(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name") || undefined;
    const description = url.searchParams.get("description") || undefined;
    const slug = url.searchParams.get("slug") || undefined;

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

    if (!name && !description && !slug) {
        return new Response("at least one of name, description, or slug must be provided", {
            status: 400,
        });
    }

    const organisation = await updateOrganisation(organisationId, {
        name,
        description,
        slug,
    });

    return Response.json(organisation);
}
