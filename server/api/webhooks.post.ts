export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const body = await readBody<WebhookBody>(event);
  const { type, data } = body;
  if (type === InteractionType.PING) {
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
    [LOLPERFIL.name]: handlerLolPerfil, // Comando /lolperfil
    [LOLMMR.name]: handlerLolMMR, // Comando /lolmmr
    [ANGAR.name]: handlerAngar, // Comando /angar
    [AVATAR.name]: handlerAvatar, // Comando /avatar
    [BANEADOS.name]: handlerBaneados, // Comando /baneados
    [COPYS.name]: handlerCopys // Comando /copys
  };

  const componentHandlers: { [key: string]: ComponentHandler } = {
    ["btn_reload"]: handlerVideoReload // Componente /video-reload
  };

  return create(type, () => {
    const { name, options, custom_id } = data;
    const commandHandler = commandHandlers[name];

    if (commandHandler) {
      return commandHandler(event, { body,
        getValue: name => getOptionsValue(name, options)
      });
    }

    const componentHandler = componentHandlers[custom_id || ""];
    if (componentHandler) {
      return componentHandler(event, { body });
    }

    throw createError({ statusCode: 400, message: "Unknown interaction type" });
  });
});
