import consola from "consola";

consola.wrapConsole();

process.loadEnvFile();

const {
  NUXT_DISCORD_TOKEN,
  KICK_2FA,
  KICK_PASSWORD,
  KICK_EMAIL,
  KICK_CHAT_CHANNEL
} = process.env;

export const useLocalConfig = () => ({
  discordToken: NUXT_DISCORD_TOKEN,
  kick2FA: KICK_2FA,
  kickPassword: KICK_PASSWORD,
  kickEmail: KICK_EMAIL,
  kickChatChannel: KICK_CHAT_CHANNEL
});
