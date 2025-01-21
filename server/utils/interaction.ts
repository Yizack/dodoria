import { InteractionResponseType, InteractionType } from "discord-api-types/v10";

const API = {
  BASE: "https://discord.com/api/v10"
};

const toDiscordEndpoint = (
  endpoint: string,
  options: {
    body?: Record<string, unknown>;
    method: "GET" | "POST" | "PATCH";
    headers?: Record<string, string>;
  }
) => {
  const endpointURL = `${API.BASE}${endpoint}`;
  const body = options.body;
  if (body && !body.files) {
    return $fetch(endpointURL, {
      ...Object.keys(body).length ? { body } : {},
      method: options.method,
      headers: options.headers
    });
  }

  if (!body) return $fetch(endpointURL, { method: options.method, headers: options.headers });
  const { files } = body as { files: { file: Blob, name: string }[] };
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`files[${i}]`, files[i]!.file, files[i]!.name);
  }
  delete body.files;
  formData.append("payload_json", JSON.stringify(body));
  return $fetch(endpointURL, {
    body: formData,
    method: options.method,
    headers: options.headers
  });
};

const pong = () => ({ type: InteractionResponseType.Pong });

export const create = (type: number, func?: VoidFunction) => {
  switch (type) {
    case InteractionType.Ping:
      console.info("Handling Ping request");
      return pong();
    case InteractionType.ApplicationCommand:
    case InteractionType.MessageComponent:
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
  type: InteractionResponseType.ChannelMessageWithSource,
  data: {
    content: content,
    embeds: options?.embeds,
    components: options?.components
  }
});

export const deferReply = (options?: { flags: number }) => ({
  type: InteractionResponseType.DeferredChannelMessageWithSource,
  data: {
    flags: options?.flags
  }
});

export const updateMessage = () => ({
  type: InteractionResponseType.UpdateMessage
});

export const deferUpdate = (
  options: {
    content?: string;
    flags?: number;
    application_id?: string;
    token?: string;
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
    files?: unknown;
    attachments?: unknown[];
    headers?: Record<string, string>;
  }
) => {
  const followupEndpoint = `/webhooks/${options.application_id}/${options.token}`;
  return toDiscordEndpoint(followupEndpoint, {
    method: "POST",
    body: {
      flags: options?.flags,
      type: InteractionResponseType.DeferredMessageUpdate,
      content: options?.content,
      embeds: options?.embeds,
      components: options?.components,
      files: options?.files,
      attachments: options?.attachments
    },
    headers: options?.headers
  });
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
    method: "PATCH",
    body: {
      content: content,
      embeds: options?.embeds,
      components: options?.components,
      files: options?.files
    }
  });
};

export const guildAuditLog = async <T>(options: {
  guild_id: string;
  token: string;
  action_type?: number;
  limit?: number;
}) => {
  const endpoint = withQuery(`/guilds/${options.guild_id}/audit-logs`, {
    limit: options?.limit || 50,
    ...options.action_type && { action_type: options.action_type }
  });
  return toDiscordEndpoint(endpoint, {
    method: "GET",
    headers: { Authorization: `Bot ${options.token}` }
  }) as T;
};
