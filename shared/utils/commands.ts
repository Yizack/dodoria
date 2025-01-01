import { ApplicationIntegrationType, InteractionContextType, ApplicationCommandOptionType } from "discord-api-types/v10";
import { LOL_SERVERS } from "./lol-servers";
import { COPYS_LIST } from "./copys-list";
import { DONOCLIPS_LIST } from "./donoclips-list";

export const MEMIDE: Command = {
  name: "memide",
  description: "Conoce cuántos centímetros te mide",
  cid: "1053392162194194523"
};

export const MECABE: Command = {
  name: "mecabe",
  description: "Conoce cuántos centímetros te caben",
  cid: "1053392162194194524"
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
  cid: "1053398798786904096"
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
  cid: "1053578283347882024"
};

export const BUENOGENTE: Command = {
  name: "buenogente",
  description: "Angar se despide de la gente",
  cid: "1053871637306540082"
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
  cid: "1056821755487997952"
};

export const COMANDOS: Command = {
  name: "comandos",
  description: "Conoce la lista de comandos disponibles",
  cid: "1053738012619571342"
};

export const VIDEO: Command = {
  name: "video",
  description: "Obtener un video de Instagram, Facebook, TikTok, X, YouTube, Twitch, Kick o Reddit en formato MP4",
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
      description: "Link de Instagram, Facebook, TikTok, X, YouTube, Twitch, Kick o Reddit",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  cid: "1225295750930501724"
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
  cid: "1225469964274630748"
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
  cid: "1225468160279580736"
};

export const ANGAR: Command = {
  name: "angar",
  description: "Muestra una foto random de Angar",
  cid: "1228534441996062740"
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
  cid: "1273575196477100064"
};

export const BANEADOS: Command = {
  name: "baneados",
  description: "Muestra una lista de los usuarios baneados, timeouteados y desbaneados más recientes",
  cid: "1319818448787865655"
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
  cid: "1323905456338636901"
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
  cid: "1323969015118430218"
};
