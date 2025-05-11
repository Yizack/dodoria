import { drizzle } from "drizzle-orm/d1";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export { eq, and, or, desc, count, inArray, sql } from "drizzle-orm";

function unixepoch ({ mode }: { mode?: "ms" | "s" }) {
  switch (mode) {
    case "ms":
      return sql`(unixepoch() * 1000)`;
    case "s":
    default:
      return sql`(unixepoch())`;
  }
}

const kickBans = sqliteTable("kick_bans", {
  id: integer().primaryKey(),
  username: text().notNull(),
  bannedBy: text().notNull(),
  expiresAt: integer(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const tables = { kickBans };

export const useDB = () => {
  return drizzle(undefined, { schema: tables, casing: "snake_case" });
};
