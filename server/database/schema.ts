import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { unixepoch } from "../utils/db";

export const kickBans = sqliteTable("kick_bans", {
  id: integer().primaryKey(),
  username: text().notNull(),
  bannedBy: text().notNull(),
  expiresAt: integer(),
  type: text().notNull().$type<"ban" | "unban">(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});
