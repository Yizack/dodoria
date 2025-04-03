export default defineCachedEventHandler(async () => {
  const botrix = new Botrix({ bypassCache: true });
  const leaderboard = await botrix.getLeaderboard();
  const bots = ["kickbot", "botrix"];

  return leaderboard.filter(user => !bots.includes(user.name.toLowerCase()));
}, { maxAge: 600 });
