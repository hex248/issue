import { Sprint } from "@sprint/shared";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../client";

export async function createSprint(
    projectId: number,
    name: string,
    color: string | undefined,
    startDate: Date,
    endDate: Date,
) {
    const [sprint] = await db
        .insert(Sprint)
        .values({
            projectId,
            name,
            ...(color ? { color } : {}),
            startDate,
            endDate,
        })
        .returning();
    return sprint;
}

export async function getSprintsByProject(projectId: number) {
    return await db.select().from(Sprint).where(eq(Sprint.projectId, projectId));
}

export async function hasOverlappingSprints(projectId: number, startDate: Date, endDate: Date) {
    const overlapping = await db
        .select({ id: Sprint.id })
        .from(Sprint)
        .where(
            and(
                eq(Sprint.projectId, projectId),
                lte(Sprint.startDate, endDate),
                gte(Sprint.endDate, startDate),
            ),
        )
        .limit(1);
    return overlapping.length > 0;
}
