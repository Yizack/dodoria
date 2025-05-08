export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const webhook = await readBody<WebhookBody>(event);
  const registerCallback = async () => {
    await event.context.cloudflare.env.QUEUE.send({ webhook, event });
  };
  event.waitUntil(registerCallback());
  return handleWebhook(event, webhook);
});
