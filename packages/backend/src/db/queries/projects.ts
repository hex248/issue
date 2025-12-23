import { Issue, Organisation, Project, User } from "@issue/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export async function createProject(blob: string, name: string, creatorId: number, organisationId: number) {
    const [project] = await db
        .insert(Project)
        .values({
            blob,
            name,
            creatorId,
            organisationId,
        })
        .returning();
    return project;
}

export async function updateProject(
    projectId: number,
    updates: { blob?: string; name?: string; creatorId?: number; organisationId?: number },
) {
    const [project] = await db.update(Project).set(updates).where(eq(Project.id, projectId)).returning();
    return project;
}

export async function deleteProject(projectId: number) {
    // delete all of the project's issues first
    await db.delete(Issue).where(eq(Issue.projectId, projectId));
    // delete actual project
    await db.delete(Project).where(eq(Project.id, projectId));
}

export async function getProjectByID(projectId: number) {
    const [project] = await db.select().from(Project).where(eq(Project.id, projectId));
    return project;
}

export async function getProjectByBlob(projectBlob: string) {
    const [project] = await db.select().from(Project).where(eq(Project.blob, projectBlob));
    return project;
}

export async function getProjectsByCreatorID(creatorId: number) {
    const projectsWithCreators = await db
        .select()
        .from(Project)
        .where(eq(Project.creatorId, creatorId))
        .leftJoin(User, eq(Project.creatorId, User.id));
    return projectsWithCreators;
}

export async function getAllProjects() {
    const projects = await db.select().from(Project);
    return projects;
}

export async function getProjectsWithCreators() {
    const projectsWithCreators = await db
        .select()
        .from(Project)
        .leftJoin(User, eq(Project.creatorId, User.id));
    return projectsWithCreators;
}

export async function getProjectWithCreatorByID(projectId: number) {
    const [projectWithCreator] = await db
        .select()
        .from(Project)
        .leftJoin(User, eq(Project.creatorId, User.id))
        .where(eq(Project.id, projectId));
    return projectWithCreator;
}

export async function getProjectsByOrganisationId(organisationId: number) {
    const projects = await db
        .select()
        .from(Project)
        .where(eq(Project.organisationId, organisationId))
        .leftJoin(User, eq(Project.creatorId, User.id))
        .leftJoin(Organisation, eq(Project.organisationId, Organisation.id));
    return projects;
}
