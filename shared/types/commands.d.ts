import type { APIApplicationCommand } from "discord-api-types/v10";

export {};

declare global {
  type CommandPartialProperties = "id" | "type" | "application_id" | "default_member_permissions" | "version";
  type ApplicationCommand = Omit<APIApplicationCommand, CommandPartialProperties> & Partial<Pick<APIApplicationCommand, CommandPartialProperties>>;
  interface Command extends ApplicationCommand {
    cid: string;
  }
}
