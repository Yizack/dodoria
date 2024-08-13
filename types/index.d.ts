export {};

declare global {
  interface CommandHelpers {
    body: WebhookBody;
    getValue: (name: string) => string;
  }

  interface CommandHandler {
    (event: H3Event, helpers: CommandHelpers): unknown;
  }
}
