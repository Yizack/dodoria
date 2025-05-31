export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidKickWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const body = await readBody<KickWebhookBody>(event);

  return handleKickWebhook(event, body);
});
