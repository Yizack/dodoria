import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord-api-types/v10";
import { LOL_SERVERS } from "./lol-servers";
import { COPYS_LIST } from "./copys-list";
import { DONOCLIPS_LIST } from "./donoclips-list";

export const MEMIDE: Command = {
  name: "memide",
  description: "Conoce cuántos centímetros te mide",
  cid: "1341276787971330182"
};

export const MECABE: Command = {
  name: "mecabe",
  description: "Conoce cuántos centímetros te caben",
  cid: "1341276787971330181"
};

export const CHEER: Command = {
  name: "cheer",
  description: "Has una prueba de tus mensajes antes de enviar bits en el canal de ANGAR",
  options: [
    {
      name: "mensaje",
      description: "El mensaje que quieres que lea el bot",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  cid: "1341276787719802937"
};

export const EDUCAR: Command = {
  name: "educar",
  description: "Intenta educar a un usuario",
  options: [
    {
      name: "usuario",
      description: "El usuario que deseas educar",
      type: ApplicationCommandOptionType.User,
      required: true
    }
  ],
  cid: "1341276787719802942"
};

export const BUENOGENTE: Command = {
  name: "buenogente",
  description: "Angar se despide de la gente",
  cid: "1341276787719802936"
};

export const SHIP: Command = {
  name: "ship",
  description: "Calcula el porcentaje de compatibilidad amorosa entre dos personas",
  options: [
    {
      name: "persona1",
      description: "El primer usuario",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "persona2",
      description: "Con quien lo shipeas",
      type: ApplicationCommandOptionType.User,
      required: true
    }
  ],
  cid: "1341276787971330183"
};

export const COMANDOS: Command = {
  name: "comandos",
  description: "Conoce la lista de comandos disponibles",
  cid: "1341276787719802938"
};

export const VIDEO: Command = {
  name: "video",
  description: "Obtener un video de Instagram, Facebook, TikTok, X, YouTube, Twitch, Kick, Reddit o Threads en formato MP4",
  integration_types: [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  ],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel
  ],
  options: [
    {
      name: "link",
      description: "Link de Instagram, Facebook, TikTok, X, YouTube, Twitch, Kick, Reddit o Threads",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  cid: "1341276787971330184"
};

export const LOLMMR: Command = {
  name: "lolmmr",
  description: "Calcula el ELO MMR aproximado de una cuenta basado en el emparejamiento de las partidas",
  options: [
    {
      name: "riot_id",
      description: "Riot ID. Ej: (Name#TAG)",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "servidor",
      description: "El servidor del invocador",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: LOL_SERVERS
    },
    {
      name: "cola",
      description: "Tipo de cola clasificatoria",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Solo/Duo", value: "SoloQ" },
        { name: "Flexible", value: "Flex" }
      ]
    }
  ],
  cid: "1341276787971330179"
};

export const LOLPERFIL: Command = {
  name: "lolperfil",
  description: "Consulta información de un usuario de League of Legends",
  options: [
    {
      name: "riot_id",
      description: "Riot ID. Ej: (Name#TAG)",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "servidor",
      description: "El servidor donde juega",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: LOL_SERVERS
    }
  ],
  cid: "1341276787971330180"
};

export const ANGAR: Command = {
  name: "angar",
  description: "Muestra una foto random de Angar",
  cid: "1341276787719802933"
};

export const AVATAR: Command = {
  name: "avatar",
  description: "Muestra el avatar de un usuario",
  integration_types: [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  ],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel
  ],
  options: [
    {
      name: "usuario",
      description: "El usuario del que quieres obtener el avatar",
      type: ApplicationCommandOptionType.User,
      required: false
    },
    {
      name: "tipo",
      description: "Selecciona el tipo de avatar",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "Global", value: "global" },
        { name: "Servidor", value: "servidor" }
      ]
    }
  ],
  cid: "1341276787719802934"
};

export const BANEADOS: Command = {
  name: "baneados",
  description: "Muestra una lista de los usuarios baneados, timeouteados y desbaneados más recientes",
  options: [
    {
      name: "plataforma",
      description: "Selecciona la plataforma",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "Discord", value: "discord" },
        { name: "Kick", value: "kick" }
      ]
    }
  ],
  cid: "1341276787719802935"
};

export const COPYS: Command = {
  name: "copys",
  description: "Obtén un copy a partir de un listado de opciones",
  options: [
    {
      name: "opcion",
      description: "Opción de la lista",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: COPYS_LIST
    }
  ],
  integration_types: [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  ],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel
  ],
  cid: "1341276787719802940"
};

export const DONOCLIPS: Command = {
  name: "donoclips",
  description: "Obtén un donoclip a partir de un listado de opciones",
  options: [
    {
      name: "opcion",
      description: "Opción de la lista",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: DONOCLIPS_LIST
    }
  ],
  integration_types: [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  ],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel
  ],
  cid: "1341276787719802941"
};

export const BOTRIX: Command = {
  name: "botrix",
  description: "Comandos de BotRix",
  options: [
    {
      name: "leaderboard",
      description: "Muestra el leaderboard de BotRix",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "tipo",
          description: "Tipo de leaderboard",
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            { name: "Puntos", value: "points" },
            { name: "Watchtime", value: "watchtime" }
          ]
        }
      ]
    },
    {
      name: "puntos",
      description: "Muestra la cantidad de puntos de un usuario de KICK",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "usuario",
          description: "El usuario de KICK a consultar",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ],
  cid: "1357314549434552372"
};

export const BANEADOS_RANKING: Command = {
  name: "baneados-ranking",
  description: "Muestra una lista de los usuarios más baneados",
  options: [
    {
      name: "plataforma",
      description: "Selecciona la plataforma",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "Kick", value: "kick" }
      ]
    }
  ],
  cid: ""
};
