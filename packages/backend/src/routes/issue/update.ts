import type { BunRequest } from "bun";
import { updateIssue } from "../../db/queries";

// /issue/update?id=1&title=Testing&description=Description&assigneeId=2
// assigneeId can be "null" to unassign
export default async function issueUpdate(req: BunRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response("missing issue id", { status: 400 });
    }

    const title = url.searchParams.get("title") || undefined;
    const description = url.searchParams.get("description") || undefined;
    const assigneeIdParam = url.searchParams.get("assigneeId");

    // Parse assigneeId: "null" means unassign, number means assign, undefined means no change
    let assigneeId: number | null | undefined;
    if (assigneeIdParam === "null") {
        assigneeId = null;
    } else if (assigneeIdParam) {
        assigneeId = Number(assigneeIdParam);
    }

    if (!title && !description && assigneeId === undefined) {
        return new Response("no updates provided", { status: 400 });
    }

    const issue = await updateIssue(Number(id), {
        title,
        description,
        assigneeId,
    });

    return Response.json(issue);
}
