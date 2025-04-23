import { InteractionType } from "discord-api-types/v10";

export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidDiscordWebhook(event);
  if (!isValidWebhook) throw createError({ statusCode: 401, message: "Unauthorized: webhook is not valid" });

  const body = await readBody<WebhookBody>(event);
  const { type, data } = body;
  if (type === InteractionType.Ping) {
    return create(type);
  }

  const commands: { name: string, handler: CommandHandler }[] = [
    handlersMemide, // Comando /memide
    handlersMecabe, // Comando /mecabe
    handlersCheer, // Comando /cheer
    handlersEducar, // Comando /educar
    handlersComandos, // Comando /comandos
    handlersBuenogente, // Comando /buenogente
    handlersShip, // Comando /ship
    handlersVideo, // Comando /video
    handlersLolperfil, // Comando /lolperfil
    handlersLolmmr, // Comando /lolmmr
    handlersAngar, // Comando /angar
    handlersAvatar, // Comando /avatar
    handlersBaneados, // Comando /baneados
    handlersCopys, // Comando /copys
    handlersDonoclips, // Comando /donoclips
    handlersBotrix // Comando /botrix
  ];

  const componentHandlers: { [prefix: string]: ComponentHandler } = {
    ["videos"]: handlerVideoReload, // Componente /video-reload
    ["baneados"]: handlerBaneadosPagination, // Componente /baneados-pagination
    ["botrix-leaderboard"]: handlerBotRixLeaderboardPagination // Componente /botrix-leaderboard-pagination
  };

  return create(type, () => {
    const { name, options, custom_id } = data;
    const command = commands.find(h => h.name === name);

    if (command) {
      return command.handler(event, { body,
        getValue: name => getOptionsValue(name, options?.[0]?.options || options)
      });
    }

    if (custom_id) {
      const handlerKey = Object.keys(componentHandlers).find(prefix => custom_id.startsWith(`${prefix}:`));
      if (handlerKey) {
        return componentHandlers[handlerKey]!(event, { body });
      }
    }

    throw createError({ statusCode: 400, message: "Unknown interaction type" });
  });
});
