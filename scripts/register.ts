/**
 * Register slash commands with a local run
 */
import { REST, Routes } from "discord.js";
import * as COMMANDS from "../shared/utils/commands";

process.loadEnvFile();

const rest = new REST({ version: "10" }).setToken(process.env.NUXT_DISCORD_TOKEN!);
const commandsArray = Object.values(COMMANDS);

console.info("Started refreshing application (/) commands.");
await rest.put(Routes.applicationCommands(process.env.NUXT_DISCORD_APPLICATION_ID!), { body: commandsArray });

console.info("Successfully reloaded application (/) commands.");
