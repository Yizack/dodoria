/**
 * Register slash commands with a local run
 */
import { REST, Routes } from "discord.js";
import { ME_MIDE, ME_CABE, CHEER, EDUCAR, BUENO_GENTE, COMANDOS } from "./commands.js";
import * as dotenv from "dotenv";
dotenv.config();

const commands = [ME_MIDE, ME_CABE, CHEER, EDUCAR, BUENO_GENTE, COMANDOS];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
