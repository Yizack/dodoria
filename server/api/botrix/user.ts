export default defineCachedEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    username: z.string()
  }).parse);

  const botrix = new BotRix({ bypassCache: true });
  const user = await botrix.getUser(query.username);

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found in leaderboard" });
  }

  return user;
}, { maxAge: 600, swr: false });
