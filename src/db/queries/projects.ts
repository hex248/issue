import { eq } from "drizzle-orm";
import { db } from "../client";
import { Project, User } from "../schema";

export async function createProject(blob: string, name: string, owner: typeof User.$inferSelect) {
    const [project] = await db
        .insert(Project)
        .values({
            blob,
            name,
            ownerId: owner.id,
        })
        .returning();
    if (!project) {
        throw new Error(`failed to create project ${name} with blob ${blob} for owner ${owner.username}`);
    }
    return project;
}

export async function getProjectByID(projectId: number) {
    const [project] = await db.select().from(Project).where(eq(Project.id, projectId));
    return project;
}

export async function getProjectByBlob(projectBlob: string) {
    const [project] = await db.select().from(Project).where(eq(Project.blob, projectBlob));
    return project;
}
