import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { unixepoch } from "../utils/db";

export const users = sqliteTable("kick_bans", {
  id: integer().primaryKey(),
  username: text().notNull(),
  bannedBy: text().notNull(),
  expiresAt: integer(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});
