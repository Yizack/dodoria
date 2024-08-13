export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const body = await readBody<WebhookBody>(event);
  const { type, data } = body;
  if (type === InteractionType.PING) {
    console.info("Handling Ping request");
    return create(type);
  }

  const commandHandlers: { [key: string]: CommandHandler } = {
    [MEMIDE.name]: handlerMeMide, // Comando /memide
    [MECABE.name]: handlerMeCabe, // Comando /mecabe
    [CHEER.name]: handlerCheer, // Comando /cheer
    [EDUCAR.name]: handlerEducar, // Comando /educar
    [COMANDOS.name]: handlerComandos, // Comando /comandos
    [BUENOGENTE.name]: handlerBuenoGente, // Comando /buenogente
    [SHIP.name]: handlerShip, // Comando /ship
    [VIDEO.name]: handlerVideo, // Comando /video
    [LOLPROFILE.name]: handlerLolProfile, // Comando /lolprofile
    [LOLMMR.name]: handlerLolMMR, // Comando /lolmmr
    [ANGAR.name]: handlerAngar // Comando /angar
  };

  return create(type, () => {
    const { name, options } = data;
    const commandHandler = commandHandlers[name];

    if (commandHandler) {
      return commandHandler(event, { body,
        getValue: (name) => getOptionsValue(name, options)
      });
    }

    setResponseStatus(event, 404);
    return { error: "Unknown Type" };
  });
});
