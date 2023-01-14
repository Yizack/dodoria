import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { getIA } from "./../src/functions.js";

dotenv.config();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildIntegrations
] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
  if (message.content.startsWith("!ia")) {
    console.log("se recibio un mensaje");
    await message.channel.sendTyping();
    const mensaje = message.content.split("!ia ")[1];
    const { username } = message.author;
    try {
      console.log(`${username} says:\n${mensaje}`);
      const respuesta = await getIA(`${username} says:\n${mensaje}`, process.env.IA_CHAT);
      console.log(respuesta);
      await message.reply(`${respuesta}`);
    } catch (error) {
      console.log(error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
