import type { H3Event } from "h3";

export {};

declare global {
  interface CommandHelpers {
    body: DiscordWebhookBody;
    getValue: <T = string>(name: string) => T | undefined;
  }

  interface CommandHandler {
    (event: H3Event, helpers: CommandHelpers): Promise<unknown> | unknown;
  }

  interface ComponentHandler {
    (event: H3Event, helpers: { body: DiscordWebhookBody }): unknown;
  }

  interface ApplicationHandler {
    (event: H3Event, helpers: { body: DiscordWebhookBody }): unknown;
  }
}
