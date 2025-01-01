import type { APIApplicationCommand } from "discord-api-types/v10";

export {};

declare global {
  interface Command extends Partial<APIApplicationCommand> {
    cid: string;
  }
}
