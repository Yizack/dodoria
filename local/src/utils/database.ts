import { drizzle } from "drizzle-orm/d1";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { useLocalConfig } from "./config";

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
  actionBy: text().notNull(),
  expiresAt: integer(),
  type: text().notNull().$type<"ban" | "unban">(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const tables = { kickBans };

export const useDB = () => {
  return drizzle(undefined, { schema: tables, casing: "snake_case" });
};

const { cloudflareAccount, cloudflareD1, cloudflareAuthorization } = useLocalConfig();

export const queryD1 = async (query: { sql: string, params?: unknown[] }) => {
  return $fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccount}/d1/database/${cloudflareD1}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cloudflareAuthorization}`,
      "Content-Type": "application/json"
    },
    body: query
  }).catch((error) => {
    console.warn("D1 Error", error);
  });
};
