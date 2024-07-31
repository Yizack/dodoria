/**
 * Register slash commands with a local run
 */
import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import * as commands from "./commands.js";

dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const commandsArray = Object.values(commands);

(async () => {
  try {
    console.info("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commandsArray });

    console.info("Successfully reloaded application (/) commands.");
  }
  catch (error) {
    console.warn(error);
  }
})();
