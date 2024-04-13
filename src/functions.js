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
