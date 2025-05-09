import type { Message } from "@cloudflare/workers-types";
import type { H3Event } from "h3";
import { getOriginalInteraction } from "../utils/interaction";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("cloudflare:queue", async (options) => {
    const { batch } = options;
    const { messages } = batch;
    for (const message of messages) {
      const { body } = message as Message<WebhookBody>;
      const { token, application_id } = body;
      body.fromQueue = true;
      const original = await getOriginalInteraction({ token, application_id }).catch(() => null);
      if (!original) return;
      if (!original.content && !original.embeds.length && !original.components.length && !original.attachments.length) {
        return handleWebhook(undefined as unknown as H3Event, body);
      }
      console.info("Webhook already processed, skipping...");
    }
  });
});
