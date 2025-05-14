import type { H3Event } from "h3";

export {};

declare global {
  interface CommandHelpers {
    body: WebhookBody;
    getValue: <T = string | undefined>(name: string) => T;
  }

  interface CommandHandler {
    (event: H3Event, helpers: CommandHelpers): Promise<unknown> | unknown;
  }

  interface ComponentHandler {
    (event: H3Event, helpers: { body: WebhookBody }): unknown;
  }
}
