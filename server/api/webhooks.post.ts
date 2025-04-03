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

  const componentHandlers: { [key: string]: ComponentHandler } = {
    ["btn_reload"]: handlerVideoReload, // Componente /video-reload
    ["btn_baneados_prev"]: handlerBaneadosPagination, // Componente /baneados-pagination
    ["btn_baneados_next"]: handlerBaneadosPagination,
    ["select_baneados_page"]: handlerBaneadosPagination,
    ["btn_botrix_leaderboard_prev"]: handlerBotRixLeaderboardPagination,
    ["btn_botrix_leaderboard_next"]: handlerBotRixLeaderboardPagination,
    ["select_botrix_leaderboard_page"]: handlerBotRixLeaderboardPagination
  };

  return create(type, () => {
    const { name, options, custom_id } = data;
    const command = commands.find(h => h.name === name);

    if (command) {
      return command.handler(event, { body,
        getValue: name => getOptionsValue(name, options?.[0]?.options || options)
      });
    }

    const componentHandler = componentHandlers[custom_id || ""];
    if (componentHandler) {
      return componentHandler(event, { body });
    }

    throw createError({ statusCode: 400, message: "Unknown interaction type" });
  });
});
