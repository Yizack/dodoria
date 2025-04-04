export default defineCachedEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    sort: z.enum(["points", "watchtime"]).optional()
  }).parse);
  const botrix = new BotRix({ bypassCache: true });
  const leaderboard = await botrix.getLeaderboard({ sort: query.sort });
  const bots = ["kickbot", "botrix"];
  return leaderboard.filter(user => !bots.includes(user.name.toLowerCase()));
}, {
  maxAge: 600,
  name: "botrix",
  group: "leaderboard",
  getKey: async (event) => {
    const query = await getValidatedQuery(event, z.object({
      sort: z.enum(["points", "watchtime"]).optional()
    }).parse);
    return query?.sort || "points";
  }
});
