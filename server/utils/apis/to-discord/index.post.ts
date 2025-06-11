export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { content, channel_id, token } = body;
  const config = useRuntimeConfig(event);
  if (token !== config.discord.token) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid token"
    });
  }
  await sendToChannel({ content, channel_id, token });
  return true;
});
