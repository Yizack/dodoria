/**
 * General functions
 */
import { CONSTANTS } from "./constants.js";

export const getValue = (name, options) => {
  const option = options.find((option) => option.name === name);
  return option?.value ?? null;
};

export const getRandom = (options) => {
  const min = options.min ?? 1;
  return Math.round((Math.random() * (options.max - min)) + min);
};

export const getRandomAngar = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.ANGAR });
  return `https://dodoria.yizack.com/images/angar_${number}.jpg`;
};

export const getRandomBuenoGente = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.BUENOGENTE });
  return `https://dodoria.yizack.com/images/buenogente_${number}.jpg`;
};

export const esUrl = (cadena) => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?:\/\S*)?$/;
  return regex.test(cadena);
};

export const imbedUrlsFromString = (str) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return str.replace(regex, "<$1>");
};

export const obtenerIDDesdeURL = (url) => {
  const expresionRegular = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const resultado = expresionRegular.exec(url);
  if (resultado && resultado.length > 1) {
    return resultado[1];
  }
  else {
    return null;
  }
};

export const errorEmbed = (error_msg) => {
  const embeds = [];
  embeds.push({
    color: CONSTANTS.COLOR,
    description: error_msg,
  });
  return embeds;
};

export const getRandomAngarMessage = () => {
  const messages = [
    "Te presento el ANGAR que te representa en este momento.",
    "Hoy estás en este mood, y el ANGAR lo refleja perfectamente.",
    "Este es el ANGAR que captura tu esencia hoy.",
    "El ANGAR de hoy refleja tu estado de ánimo actual.",
    "Descubre el ANGAR que encaja con tu vibra de hoy.",
    "Este ANGAR coincide con tu energía en este día.",
    "El ANGAR de hoy está en sintonía con tu estado de ánimo.",
    "Hoy te presento el ANGAR que mejor representa tu vibe.",
    "Este ANGAR en particular se alinea con tu estado de ánimo actual.",
    "¡Descubre el ANGAR que te acompaña en este momento!"
  ];
  return messages[getRandom({ min: 0, max: messages.length - 1 })];
};
