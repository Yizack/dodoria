export const ME_MIDE = {
  name: "memide",
  description: "Conoce cuántos centímetros te mide.",
  options: []
};

export const ME_CABE = {
  name: "mecabe",
  description: "Conoce cuántos centímetros te caben.",
  options: []
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
  ]
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
  ]
};

export const BUENO_GENTE = {
  name: "buenogente",
  description: "Angar se despide de la gente.",
  options: []
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
  ]
};

export const COMANDOS = {
  name: "comandos",
  description: "Conoce la lista de comandos disponibles.",
  options: []
};
