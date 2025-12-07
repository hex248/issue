import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("User", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 256 }).notNull(),
    username: varchar({ length: 32 }).notNull().unique(),
});
