export default defineEventHandler(async (event) => {
  const params = await getValidatedQuery(event, z.object({
    channel_id: z.string(),
    token: z.string(),
    message_id: z.string()
  }).parse);

  const config = useRuntimeConfig(event);
  if (params.token !== config.discord.token) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid token"
    });
  }

  await deleteMessage(params);
});
