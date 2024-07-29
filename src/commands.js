import { CONSTANTS } from "./constants.js";

const IntegrationTypes = {
  GUILD_INSTALL: 0,
  USER_INSTALL: 1,
  ALL: [0, 1]
};

const Contexts = {
  GUILD: 0,
  BOT_DM: 1,
  PRIVATE_CHANNEL: 2,
  ALL: [0, 1, 2]
};

export const ME_MIDE = {
  name: "memide",
  description: "Conoce cuántos centímetros te mide.",
  options: [],
  cid: "1053392162194194523"
};

export const ME_CABE = {
  name: "mecabe",
  description: "Conoce cuántos centímetros te caben.",
  options: [],
  cid: "1053392162194194524"
};

export const CHEER = {
  name: "cheer",
  description: "Has una prueba de tus mensajes antes de enviar bits en el canal de ANGAR.",
  options: [
    {
      "name": "mensaje",
      "description": "El mensaje que quieres que lea el bot.",
      "type": 3,
      "required": true
    }
  ],
  cid: "1053398798786904096"
};

export const EDUCAR = {
  name: "educar",
  description: "Intenta educar a un usuario.",
  options: [
    {
      "name": "usuario",
      "description": "El usuario que deseas educar.",
      "type": 6,
      "required": true
    }
  ],
  cid: "1053578283347882024"
};

export const BUENO_GENTE = {
  name: "buenogente",
  description: "Angar se despide de la gente.",
  options: [],
  cid: "1053871637306540082"
};

export const SHIP = {
  name: "ship",
  description: "Calcula el porcentaje de compatibilidad amorosa entre dos personas.",
  options: [
    {
      "name": "persona1",
      "description": "El primer usuario.",
      "type": 6,
      "required": true
    },
    {
      "name": "persona2",
      "description": "Con quien lo shipeas.",
      "type": 6,
      "required": true
    }
  ],
  cid: "1056821755487997952"
};

export const COMANDOS = {
  name: "comandos",
  description: "Conoce la lista de comandos disponibles.",
  options: [],
  cid: "1053738012619571342"
};

/*
export const FUCK = {
  name: "fuck",
  description: "Te follas a alguien.",
  options: [
    {
      "name": "usuario",
      "description": "El usuario que deseas follarte.",
      "type": 6,
      "required": true
    }
  ],
  cid: "1059919293954920459"
};

export const IA = {
  name: "ia",
  description: "Habla con la inteligencia artificial de Angar.",
  options: [
    {
      "name": "mensaje",
      "description": "El mensaje que quieres enviar a la inteligencia artificial.",
      "type": 3,
      "required": true
    }
  ]
};
*/

export const VIDEO = {
  name: "video",
  description: "Obtener un video de Instagram, Facebook, TikTok, Twitter, YouTube, Twitch o Kick en formato MP4.",
  integration_types: IntegrationTypes.ALL,
  contexts: Contexts.ALL,
  options: [
    {
      "name": "link",
      "description": "Link de Instagram, Facebook, TikTok, Twitter, YouTube, Twitch o Kick.",
      "type": 3,
      "required": true
    }
  ],
  cid: "1225295750930501724",
};

export const LOLMMR = {
  name: "lolmmr",
  description: "Calcula el ELO MMR aproximado de una cuenta basado en el emparejamiento de las partidas.",
  options: [
    {
      "name": "riot_id",
      "description": "Riot ID. Ej: (Name#TAG).",
      "type": 3,
      "required": true
    },
    {
      "name": "servidor",
      "description": "El servidor del invocador",
      "type": 3,
      "required": true,
      "choices": CONSTANTS.LOL_SERVERS
    },
    {
      "name": "cola",
      "description": "Tipo de cola clasificatoria",
      "type": 3,
      "required": true,
      "choices": [
        {
          "name": "Solo/Duo",
          "value": "SoloQ"
        },
        {
          "name": "Flexible",
          "value": "Flex"
        }
      ]
    }
  ],
  cid: "1225469964274630748"
};

export const LOLPROFILE = {
  name: "lolperfil",
  description: "Consulta información de un usuario de League of Legends",
  options: [
    {
      "name": "riot_id",
      "description": "Riot ID. Ej: (Name#TAG).",
      "type": 3,
      "required": true
    },
    {
      "name": "servidor",
      "description": "El servidor donde juega.",
      "type": 3,
      "required": true,
      "choices": CONSTANTS.LOL_SERVERS
    }
  ],
  cid: "1225468160279580736",
};

export const ANGAR = {
  name: "angar",
  description: "Devuelve una foto random de Angar.",
  options: [],
  cid: "1228534441996062740",
};
