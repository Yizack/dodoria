export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const { channel_id, token, message_id } = params;
  const config = useRuntimeConfig(event);
  if (token !== config.discord.token) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid token"
    });
  }
  await deleteMessage({ channel_id, token, message_id });
  return true;
});
