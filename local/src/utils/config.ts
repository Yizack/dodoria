import consola from "consola";

consola.wrapConsole();

process.loadEnvFile();

const {
  NUXT_DISCORD_TOKEN: discordToken,
  KICK_2FA: kick2FA,
  KICK_PASSWORD: kickPassword,
  KICK_EMAIL: kickEmail
} = process.env;

export const useLocalConfig = () => ({
  discordToken,
  kick2FA,
  kickPassword,
  kickEmail
});
