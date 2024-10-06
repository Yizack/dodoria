/**
 * Discord interactions manager
 */
import { InteractionResponseType, InteractionType } from "discord-interactions";

const API = {
  BASE: "https://discord.com/api/v10"
};

const toDiscordEndpoint = (endpoint: string, body: Record<string, unknown>, method: "POST" | "PATCH", authorization?: string) => {
  const endpointURL = `${API.BASE}${endpoint}`;
  if (!body.files) {
    return $fetch(endpointURL, {
      body,
      method,
      headers: authorization ? {
        Authorization: authorization
      } : {}
    });
  }

  const { files } = body as { files: { file: Blob, name: string }[] };
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`files[${i}]`, files[i]!.file, files[i]!.name);
  }
  delete body.files;
  formData.append("payload_json", JSON.stringify(body));
  return $fetch(endpointURL, {
    body: formData,
    method,
    headers: authorization ? {
      Authorization: authorization
    } : {}
  });
};

const pong = () => ({ type: InteractionResponseType.PONG });

export const create = (type: number, func?: () => void) => {
  switch (type) {
    case InteractionType.PING:
      return pong();
    case InteractionType.APPLICATION_COMMAND:
      if (func) return func();
  }
};

export const reply = (
  content: string | null,
  options?: {
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
  }
) => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: content,
    embeds: options?.embeds,
    components: options?.components
  }
});

export const deferReply = (options?: { flags: number }) => ({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    flags: options?.flags
  }
});

export const updateMessage = () => ({
  type: InteractionResponseType.UPDATE_MESSAGE
});

export const deferUpdate = (
  content: unknown,
  options: {
    application_id?: string;
    token?: string;
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
    files?: unknown;
  }
) => {
  const followupEndpoint = `/webhooks/${options.application_id}/${options.token}`;
  return toDiscordEndpoint(followupEndpoint, {
    type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    content: content,
    embeds: options?.embeds,
    components: options?.components,
    files: options?.files
  }, "POST");
};

export const editFollowUpMessage = (
  content: unknown,
  options: {
    application_id?: string;
    token?: string;
    message_id?: string;
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
    files?: unknown;
  }
) => {
  const endpoint = `/webhooks/${options.application_id}/${options.token}/messages/${options.message_id}`;
  return toDiscordEndpoint(endpoint, {
    content: content,
    embeds: options?.embeds,
    components: options?.components,
    files: options?.files
  }, "PATCH");
};
