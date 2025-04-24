import { AuditLogEvent } from "discord-api-types/v10";
import type { H3Event } from "h3";

export { hash } from "ohash";
export { withQuery, parseURL, getQuery as getQueryUfo } from "ufo";
export { z } from "zod";

export const getOptionsValue = (name: string, options: DiscordBodyOptions[] | null) => {
  const option = options?.find(option => option.name === name);
  return option?.value;
};

export const getRandom = (options: { min?: number, max: number }) => {
  const min = options.min ?? 1;
  return Math.round((Math.random() * (options.max - min)) + min);
};

export const getRandomAngar = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.ANGAR });
  return `https://dodoria.yizack.com/images/angar/${number}.jpg`;
};

export const getRandomBuenoGente = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.BUENOGENTE });
  return `https://dodoria.yizack.com/images/buenogente/${number}.jpg`;
};

export const esUrl = (cadena: string) => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?:\/\S*)?$/;
  return regex.test(cadena);
};

export const imbedUrlsFromString = (str: string) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return str.replace(regex, "<$1>");
};

export const obtenerIDDesdeURL = (url: string) => {
  const expresionRegular = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const resultado = expresionRegular.exec(url);
  if (resultado && resultado.length > 1) {
    return resultado[1];
  }
  else {
    return null;
  }
};

export const errorEmbed = (error_msg: string) => {
  const embeds = [];
  embeds.push({
    color: CONSTANTS.COLOR,
    description: error_msg
  });
  return embeds;
};

const discordCDN = "https://cdn.discordapp.com";

export const getAvatarURL = (options: {
  userId: string;
  avatarHash?: string | null;
  userDiscriminator?: string | number;
  imageSize?: 256 | 512 | 1024;
  guildId?: string;
}): string => {
  const { userId, avatarHash, userDiscriminator, imageSize, guildId } = options;
  const discriminator = Number(userDiscriminator);
  const defaultIndex = discriminator ? discriminator % 5 : Number((BigInt(userId) >> 22n) % 6n);
  const format = avatarHash?.startsWith("a_") ? "gif" : "png";
  const size = imageSize ?? 256;
  const imageURI = guildId ? `/guilds/${guildId}/users/${userId}/avatars/${avatarHash}` : `/avatars/${userId}/${avatarHash}`;
  const defaultAvatarURI = `/embed/avatars/${defaultIndex}`;
  return discordCDN + (avatarHash ? imageURI : defaultAvatarURI) + `.${format}?size=${size}`;
};

export const buildBaneadosEmbed = (entries: BaneadoEntry[], pagesAvailable: number, currentPage: number) => {
  const values = entries.map((el) => {
    const date = el.timeoutUntil ? Math.floor(new Date(el.timeoutUntil).getTime() / 1000) : null;
    const now = Math.floor(Date.now() / 1000);
    const timeout = date ? `<t:${date}:d>, <t:${date}:t>` : "N/A";
    const removedTimeout = !date && el.action === AuditLogEvent.MemberUpdate ? " removido" : "";
    const action = el.action === AuditLogEvent.MemberBanAdd ? "baneado" : el.action === AuditLogEvent.MemberBanRemove ? "desbaneado" : `timeout${removedTimeout}`;
    const timeoutEmoji = now > date! || !date ? "🟩" : "🟨";
    const banUnbanEmoji = action === "baneado" ? "🟥" : "🟩";
    const messageValue = action === "timeout" ? `${timeoutEmoji} **${el.username}**・${action} hasta: ${timeout}` : `${banUnbanEmoji} **${el.username}**・${action}`;
    return messageValue;
  });
  const embeds: DiscordEmbed[] = [];
  embeds.push({
    color: CONSTANTS.COLOR,
    fields: [{
      name: "Historial de bans, timeouts y unbans recientes en discord",
      value: values.join("\n")
    }],
    footer: {
      text: `Página ${currentPage} de ${pagesAvailable}`
    }
  });
  return embeds;
};

export const createCachedData = <T>(event: H3Event, name: string, cache: { id: string, data: T }) => {
  return defineCachedFunction<T>(async (_event: H3Event) => cache?.data, {
    maxAge: 86400,
    swr: false,
    group: "fn",
    name: name,
    getKey: (_event: H3Event) => cache?.id
  })(event);
};

export const defineCommandHandler = (name: string, handler: CommandHandler) => ({
  name,
  handler: (event: H3Event, helpers: CommandHelpers) => handler(event, helpers)
});
