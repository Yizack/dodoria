export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const body = await readBody<WebhookBody>(event);
  const { type, data, channel_id } = body;
  if (type === InteractionType.PING) {
    console.info("Handling Ping request");
    return create(type);
  }

  const commandHandlers: { [key: string]: CommandHandler } = {
    [COMMANDS.MEMIDE.name]: handlerMeMide, // Comando /memide
    [COMMANDS.MECABE.name]: handlerMeCabe, // Comando /mecabe
    [COMMANDS.CHEER.name]: handlerCheer, // Comando /cheer
    [COMMANDS.EDUCAR.name]: handlerEducar, // Comando /educar
    [COMMANDS.COMANDOS.name]: handlerComandos, // Comando /comandos
    [COMMANDS.BUENOGENTE.name]: handlerBuenoGente, // Comando /buenogente
    [COMMANDS.SHIP.name]: handlerShip, // Comando /ship
    [COMMANDS.VIDEO.name]: handlerVideo, // Comando /video
    [COMMANDS.LOLPROFILE.name]: handlerLolProfile, // Comando /lolprofile
    [COMMANDS.LOLMMR.name]: handlerLolMMR, // Comando /lolmmr
    [COMMANDS.ANGAR.name]: handlerAngar // Comando /angar
  };

  if (channel_id === CONSTANTS.CHANNEL || channel_id === CONSTANTS.CHANNEL_PRUEBAS) {
    return create(type, () => {
      const { name } = data;
      const commandHandler = commandHandlers[name];

      if (commandHandler) {
        return commandHandler(event, body);
      }

      setResponseStatus(event, 404);
      return { error: "Unknown Type" };
    });
  }
});
