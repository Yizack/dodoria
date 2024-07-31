import { Client, GatewayIntentBits } from "discord.js";
import CharacterAI from "characterai.js";
import * as dotenv from "dotenv";

dotenv.config();

const getCharResponse = async (message) => {
  const characterAI = new CharacterAI(process.env.AI_KEY, process.env.CHARACTER_ID);
  const chat = await characterAI.continueOrCreateChat();
  const response = await chat.sendAndAwaitResponse({ message, singleReply: true });
  return response;
};

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildIntegrations
] });

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!ia")) {
    await message.channel.sendTyping();
    const mensaje = message.content.split("!ia ")[1];
    console.info(mensaje);
    const { username } = message.author;
    try {
      const respuesta = await getCharResponse(`${username} says:\n${mensaje}`);
      console.info(respuesta);
      await message.reply(`${respuesta}`);
    }
    catch (error) {
      console.info(error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
