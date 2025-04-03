export default defineCachedEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    name: z.string()
  }).parse);

  const botrix = new Botrix({ bypassCache: true });
  const user = await botrix.getUser(query.name);

  if (!user) {
    return createError({ statusCode: 404, message: "User not found in leaderboard" });
  }

  return user;
}, { maxAge: 600 });
