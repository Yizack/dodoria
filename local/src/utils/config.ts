import consola from "consola";

consola.wrapConsole();

process.loadEnvFile();

const {
  NUXT_DISCORD_TOKEN,
  NUXT_OAUTH_KICK_CLIENT_ID,
  NUXT_OAUTH_KICK_CLIENT_SECRET,
  KICK_CHAT_CHANNEL,
  CLOUDFLARE_ACCOUNT,
  CLOUDFLARE_D1,
  CLOUDFLARE_AUTHORIZATION,
  CLOUDFLARE_KV_ID
} = process.env;

export const useLocalConfig = () => ({
  discordToken: NUXT_DISCORD_TOKEN,
  kickClientId: NUXT_OAUTH_KICK_CLIENT_ID,
  kickClientSecret: NUXT_OAUTH_KICK_CLIENT_SECRET,
  kickChatChannel: KICK_CHAT_CHANNEL,
  cloudflareAccount: CLOUDFLARE_ACCOUNT,
  cloudflareD1: CLOUDFLARE_D1,
  cloudflareAuthorization: CLOUDFLARE_AUTHORIZATION,
  cloudflareKVId: CLOUDFLARE_KV_ID
});
