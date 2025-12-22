import type { BunRequest } from "bun";
import { createOrganisation } from "../../db/queries";

// /organisation/create?name=Org%20Name&slug=org-name&description=Optional%20description
export default async function organisationCreate(req: BunRequest) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    const slug = url.searchParams.get("slug");
    const description = url.searchParams.get("description") || undefined;

    if (!name || !slug) {
        return new Response(`missing parameters: ${!name ? "name " : ""}${!slug ? "slug" : ""}`, {
            status: 400,
        });
    }

    // Check if organisation with slug already exists
    // TODO: Add this check when we have a getOrganisationBySlug function

    const organisation = await createOrganisation(name, slug, description);

    return Response.json(organisation);
}
