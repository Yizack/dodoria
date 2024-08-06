export {};

declare global {
  interface CommandHandler {
    (event: H3Event, body: WebhookBody): unknown;
  }
}
