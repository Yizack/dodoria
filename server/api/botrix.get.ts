export default defineCachedEventHandler(async () => {
  const data = await $fetch<BotrixUser[]>("https://botrix.live//api/public/leaderboard", {
    query: { user: "angar", platform: "kick" }
  });
  return data.filter(el => !["kickbot", "botrix"].includes(el.name.toLowerCase()));
}, { maxAge: 600 });
