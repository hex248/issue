import type { BunRequest } from "bun";
import { deleteOrganisation, getOrganisationById } from "../../db/queries";

// /organisation/delete?id=1
export default async function organisationDelete(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response("organisation id is required", { status: 400 });
    }

    const organisationId = Number(id);
    if (!Number.isInteger(organisationId)) {
        return new Response("organisation id must be an integer", { status: 400 });
    }

    const organisation = await getOrganisationById(organisationId);
    if (!organisation) {
        return new Response(`organisation with id ${id} not found`, { status: 404 });
    }

    await deleteOrganisation(organisationId);

    return Response.json({ success: true });
}
