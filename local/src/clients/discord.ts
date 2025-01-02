import { Client, Events, GatewayIntentBits } from "discord.js";
import { useLocalConfig } from "../utils/config";

const { discordToken } = useLocalConfig();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
] });

client.on(Events.ClientReady, async () => {
  if (!client.user) throw new Error("Discord Client user not found");
  console.info(`Logged in on Discord as ${client.user.tag}!`);
});

client.login(discordToken);

export const Discord = {
  client,
  token: discordToken
};
