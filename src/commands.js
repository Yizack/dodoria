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
/*
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
