import type { BunRequest } from "bun";
import { updateIssue } from "../../db/queries";

// /issue/update?id=1&title=Testing&description=Description&assigneeId=2&status=IN%20PROGRESS
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
    const status = url.searchParams.get("status") || undefined;

    // Parse assigneeId: "null" means unassign, number means assign, undefined means no change
    let assigneeId: number | null | undefined;
    if (assigneeIdParam === "null") {
        assigneeId = null;
    } else if (assigneeIdParam) {
        assigneeId = Number(assigneeIdParam);
    }

    if (!title && !description && assigneeId === undefined && !status) {
        return new Response("no updates provided", { status: 400 });
    }

    const issue = await updateIssue(Number(id), {
        title,
        description,
        assigneeId,
        status,
    });

    return Response.json(issue);
}
