import { Organisation, OrganisationMember } from "@issue/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export async function createOrganisation(name: string, slug: string, description?: string) {
    const [organisation] = await db
        .insert(Organisation)
        .values({
            name,
            slug,
            description,
        })
        .returning();
    return organisation;
}

export async function createOrganisationMember(
    organisationId: number,
    userId: number,
    role: string = "member",
) {
    const [member] = await db
        .insert(OrganisationMember)
        .values({
            organisationId,
            userId,
            role,
        })
        .returning();
    return member;
}

export async function getOrganisationById(id: number) {
    const [organisation] = await db.select().from(Organisation).where(eq(Organisation.id, id));
    return organisation;
}

export async function getOrganisationsByUserId(userId: number) {
    const organisations = await db
        .select()
        .from(OrganisationMember)
        .where(eq(OrganisationMember.userId, userId))
        .innerJoin(Organisation, eq(OrganisationMember.organisationId, Organisation.id));
    return organisations;
}
