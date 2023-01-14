/**
 * General functions
 */

import CharacterAI from "./characterAI/Client.js";

export const getValue = (name, options) => {
  const option = options.find((option) => option.name === name);
  return option?.value ?? null;
};

export const getRandom = (options) => {
  const min = options.min ?? 1;
  return Math.round((Math.random() * (options.max - min)) + min);
};

export const getIA = async (mensaje, IA_CHAT) => {
  const characterAi = new CharacterAI();
  const chat = await characterAi.continueOrCreateChat(IA_CHAT);
  const response = await chat.sendAndAwaitResponse({ mensaje, singleReply: true});
  return response;
};
