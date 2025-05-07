export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const webhook = await readBody<WebhookBody>(event);
  const config = useRuntimeConfig(event);
  const registerCallback = async () => {
    await createInteractionCallback({
      id,
      token,
      authorization: `Bot ${config.discord.token}`
    });
    await event.context.cloudflare.env.QUEUE.send({ webhook, event });
  };
  const { token, id } = webhook;
  event.waitUntil(registerCallback());
  return handleWebhook(event, webhook);
});
