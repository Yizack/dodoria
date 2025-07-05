/**
 * Register slash commands with a local run
 */
import { REST, Routes } from "discord.js";
import * as COMMANDS from "../shared/utils/commands";

process.loadEnvFile();

const commandsArray = Object.values(COMMANDS);
const { NUXT_DISCORD_TOKEN, NUXT_DISCORD_APPLICATION_ID } = process.env;

const rest = new REST({ version: "10" }).setToken(NUXT_DISCORD_TOKEN!);

console.info("Started refreshing application (/) commands.");
await rest.put(Routes.applicationCommands(NUXT_DISCORD_APPLICATION_ID!), { body: commandsArray });
console.info("Successfully reloaded application (/) commands.");
