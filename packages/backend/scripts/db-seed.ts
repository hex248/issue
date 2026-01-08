import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Issue, Organisation, OrganisationMember, Project, User } from "@issue/shared";
import bcrypt from "bcrypt";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const db = drizzle({
    connection: {
        connectionString: DATABASE_URL,
    },
});

const hashPassword = (password: string) => bcrypt.hash(password, 10);

const issueTitles = [
    "Fix login redirect loop",
    "Add pagination to user list",
    "Update dependencies to latest versions",
    "Refactor authentication middleware",
    "Add unit tests for payment service",
    "Fix memory leak in websocket handler",
    "Implement password reset flow",
    "Add caching for API responses",
    "Fix date formatting in reports",
    "Add export to CSV feature",
    "Improve error messages for form validation",
    "Fix race condition in queue processor",
    "Add dark mode support",
    "Optimize database queries for dashboard",
    "Fix broken image uploads on Safari",
    "Add rate limiting to public endpoints",
    "Implement user activity logging",
    "Fix timezone handling in scheduler",
    "Add search functionality to admin panel",
    "Refactor legacy billing code",
    "Fix email template rendering",
    "Add webhook retry mechanism",
    "Improve loading states across app",
    "Fix notification preferences not saving",
    "Add bulk delete for archived items",
    "Fix SSO integration with Okta",
    "Add two-factor authentication",
    "Fix scroll position reset on navigation",
    "Implement lazy loading for images",
    "Add audit log for sensitive actions",
    "Fix PDF generation timeout",
    "Add keyboard shortcuts for common actions",
];

const issueDescriptions = [
    "Users are reporting this issue in production. Need to investigate and fix.",
    "This has been requested by several customers. Should be straightforward to implement.",
    "Low priority but would improve developer experience.",
    "Blocking other work. Please prioritize.",
    "Follow-up from the security audit.",
    "Performance improvement that could reduce server costs.",
    "Part of the Q1 roadmap.",
    "Tech debt that we should address soon.",
];

async function seed() {
    console.log("seeding database with demo data...");

    try {
        const passwordHash = await hashPassword("a");

        // create 2 users
        console.log("creating users...");
        const users = await db
            .insert(User)
            .values([
                { name: "user 1", username: "u1", passwordHash, avatarURL: null },
                { name: "user 2", username: "u2", passwordHash, avatarURL: null },
            ])
            .returning();

        const u1 = users[0]!;
        const u2 = users[1]!;

        console.log(`created ${users.length} users`);

        // create 2 orgs per user (4 total)
        console.log("creating organisations...");
        const orgs = await db
            .insert(Organisation)
            .values([
                { name: "u1o1", slug: "u1o1", description: "User 1 organisation 1" },
                { name: "u1o2", slug: "u1o2", description: "User 1 organisation 2" },
                { name: "u2o1", slug: "u2o1", description: "User 2 organisation 1" },
                { name: "u2o2", slug: "u2o2", description: "User 2 organisation 2" },
            ])
            .returning();

        const u1o1 = orgs[0]!;
        const u1o2 = orgs[1]!;
        const u2o1 = orgs[2]!;
        const u2o2 = orgs[3]!;

        console.log(`created ${orgs.length} organisations`);

        // add members to organisations
        console.log("adding organisation members...");
        await db.insert(OrganisationMember).values([
            { organisationId: u1o1.id, userId: u1.id, role: "owner" },
            { organisationId: u1o1.id, userId: u2.id, role: "member" },
            { organisationId: u1o2.id, userId: u1.id, role: "owner" },
            { organisationId: u1o2.id, userId: u2.id, role: "member" },
            { organisationId: u2o1.id, userId: u2.id, role: "owner" },
            { organisationId: u2o1.id, userId: u1.id, role: "member" },
            { organisationId: u2o2.id, userId: u2.id, role: "owner" },
            { organisationId: u2o2.id, userId: u1.id, role: "member" },
        ]);

        console.log("added organisation members");

        // create 2 projects per org (8 total)
        console.log("creating projects...");
        const projects = await db
            .insert(Project)
            .values([
                { key: "11P1", name: "u1o1p1", organisationId: u1o1.id, creatorId: u1.id },
                { key: "11P2", name: "u1o1p2", organisationId: u1o1.id, creatorId: u1.id },
                { key: "12P1", name: "u1o2p1", organisationId: u1o2.id, creatorId: u1.id },
                { key: "12P2", name: "u1o2p2", organisationId: u1o2.id, creatorId: u1.id },
                { key: "21P1", name: "u2o1p1", organisationId: u2o1.id, creatorId: u2.id },
                { key: "21P2", name: "u2o1p2", organisationId: u2o1.id, creatorId: u2.id },
                { key: "22P1", name: "u2o2p1", organisationId: u2o2.id, creatorId: u2.id },
                { key: "22P2", name: "u2o2p2", organisationId: u2o2.id, creatorId: u2.id },
            ])
            .returning();

        console.log(`created ${projects.length} projects`);

        // create 0-4 issues per project
        console.log("creating issues...");
        const allUsers = [u1, u2];
        const issueValues = [];
        let issueTitleIndex = 0;

        for (const project of projects) {
            const numIssues = Math.floor(Math.random() * 5); // 0-4 issues
            for (let i = 1; i <= numIssues; i++) {
                const creator = allUsers[Math.floor(Math.random() * allUsers.length)]!;
                const assignee =
                    Math.random() > 0.3 ? allUsers[Math.floor(Math.random() * allUsers.length)] : null;
                const title = issueTitles[issueTitleIndex % issueTitles.length]!;
                const description = issueDescriptions[Math.floor(Math.random() * issueDescriptions.length)]!;
                issueTitleIndex++;

                issueValues.push({
                    projectId: project.id,
                    number: i,
                    title,
                    description,
                    creatorId: creator.id,
                    assigneeId: assignee?.id ?? null,
                });
            }
        }

        if (issueValues.length > 0) {
            await db.insert(Issue).values(issueValues);
        }

        console.log(`created ${issueValues.length} issues`);

        console.log("database seeding complete");
        console.log("\ndemo accounts (password: a):");
        console.log("  - u1");
        console.log("  - u2");
    } catch (error) {
        console.error("failed to seed database:", error);
        process.exit(1);
    }

    process.exit(0);
}

seed();
