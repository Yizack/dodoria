export default defineOAuthKickEventHandler({
  config: {
    scope: ["user:read", "channel:read", "chat:write"]
  },
  async onSuccess (event, { user, tokens }) {
    if (!import.meta.dev) return;
    console.info("KICK OAuth success:", user, tokens);
    setUserSession(event, {
      user
    });
  },
  // Optional, will return a json error and 401 status code by default
  onError (event, error) {
    console.warn("KICK OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
