export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    content: z.string().min(1),
    channel_id: z.string().min(1),
    token: z.string()
  }).parse);

  const config = useRuntimeConfig(event);
  if (body.token !== config.discord.token) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Invalid token"
    });
  }
  await sendToChannel(body);
});
