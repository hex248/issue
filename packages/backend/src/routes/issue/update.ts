import { type IssueRecord, IssueUpdateRequestSchema } from "@sprint/shared";
import type { BunRequest } from "bun";
import { getIssueByID, setIssueAssignees, updateIssue } from "../../db/queries";
import { errorResponse, parseJsonBody } from "../../validation";

export default async function issueUpdate(req: BunRequest) {
    const parsed = await parseJsonBody(req, IssueUpdateRequestSchema);
    if ("error" in parsed) return parsed.error;

    const { id, title, description, status, assigneeIds, sprintId } = parsed.data;

    // check that at least one field is being updated
    if (
        title === undefined &&
        description === undefined &&
        status === undefined &&
        assigneeIds === undefined &&
        sprintId === undefined
    ) {
        return errorResponse("no updates provided", "NO_UPDATES", 400);
    }

    const hasIssueFieldUpdates =
        title !== undefined || description !== undefined || status !== undefined || sprintId !== undefined;

    let issue: IssueRecord | undefined;
    if (hasIssueFieldUpdates) {
        [issue] = await updateIssue(id, {
            title,
            description,
            sprintId,
            status,
        });
    } else {
        issue = await getIssueByID(id);
    }

    if (assigneeIds !== undefined) {
        await setIssueAssignees(id, assigneeIds ?? []);
    }

    return Response.json(issue);
}
