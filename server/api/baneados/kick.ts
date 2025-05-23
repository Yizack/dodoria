export default defineEventHandler(async () => {
  const DB = useDB();
  const entries = await DB.select().from(tables.kickBans).orderBy(desc(tables.kickBans.createdAt)).all();
  if (!entries.length) {
    throw new Error("No hay logs para mostrar.");
  }
  return entries.map(entry => ({
    id: entry.id,
    username: entry.username,
    action: entry.type,
    timestamp: entry.createdAt,
    timeoutUntil: entry.expiresAt
  }));
});
