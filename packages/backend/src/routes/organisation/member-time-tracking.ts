import { calculateBreakTimeMs, calculateWorkTimeMs, isTimerRunning } from "@sprint/shared";
import { z } from "zod";
import type { AuthedRequest } from "../../auth/middleware";
import {
    getOrganisationById,
    getOrganisationMemberRole,
    getOrganisationMemberTimedSessions,
} from "../../db/queries";
import { errorResponse, parseQueryParams } from "../../validation";

const OrgMemberTimeTrackingQuerySchema = z.object({
    organisationId: z.coerce.number().int().positive("organisationId must be a positive integer"),
    fromDate: z.coerce.date().optional(),
});

// GET /organisation/member-time-tracking?organisationId=123&fromDate=2024-01-01
export default async function organisationMemberTimeTracking(req: AuthedRequest) {
    const url = new URL(req.url);
    const parsed = parseQueryParams(url, OrgMemberTimeTrackingQuerySchema);
    if ("error" in parsed) return parsed.error;

    const { organisationId, fromDate } = parsed.data;

    // Check organisation exists
    const organisation = await getOrganisationById(organisationId);
    if (!organisation) {
        return errorResponse(`organisation with id ${organisationId} not found`, "ORG_NOT_FOUND", 404);
    }

    // Check user is admin or owner of the organisation
    const memberRole = await getOrganisationMemberRole(organisationId, req.userId);
    if (!memberRole) {
        return errorResponse("you are not a member of this organisation", "NOT_MEMBER", 403);
    }

    const role = memberRole.role;
    if (role !== "owner" && role !== "admin") {
        return errorResponse("you must be an owner or admin to view member time tracking", "FORBIDDEN", 403);
    }

    // Get timed sessions for all organisation members
    const sessions = await getOrganisationMemberTimedSessions(organisationId, fromDate);

    // Enrich with calculated times
    // timestamps come from the database as strings, need to convert to Date objects for calculation
    const enriched = sessions.map((session) => {
        const timestamps = session.timestamps.map((t) => new Date(t));
        return {
            id: session.id,
            userId: session.userId,
            issueId: session.issueId,
            issueNumber: session.issueNumber,
            projectKey: session.projectKey,
            timestamps: session.timestamps, // Return original strings for JSON serialization
            endedAt: session.endedAt,
            createdAt: session.createdAt,
            workTimeMs: calculateWorkTimeMs(timestamps),
            breakTimeMs: calculateBreakTimeMs(timestamps),
            isRunning: session.endedAt === null && isTimerRunning(timestamps),
        };
    });

    return Response.json(enriched);
}
