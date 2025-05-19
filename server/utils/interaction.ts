import { InteractionResponseType, InteractionType, type MessageFlags, Routes } from "discord-api-types/v10";

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
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Dodoria (Cloudflare Workers)",
        ...options.headers
      }
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
    flags?: MessageFlags;
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
  }
) => ({
  type: InteractionResponseType.ChannelMessageWithSource,
  data: {
    flags: options?.flags,
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
    fromQueue?: boolean;
  }
) => {
  const followupEndpoint = !options?.fromQueue ? `/webhooks/${options.application_id}/${options.token}` : `/webhooks/${options.application_id}/${options.token}/messages/@original`;
  return toDiscordEndpoint(followupEndpoint, {
    method: !options?.fromQueue ? "POST" : "PATCH",
    body: {
      flags: options?.flags,
      ...!options?.fromQueue && { type: InteractionResponseType.DeferredMessageUpdate },
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
  content: string | null,
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

export const getOriginalInteraction = async (options: {
  token: string;
  application_id: string;
}) => {
  const { token, application_id } = options;
  const endpoint = Routes.webhookMessage(application_id, token, "@original");
  return toDiscordEndpoint(endpoint, {
    method: "GET"
  }) as Promise<DiscordMessage>;
};

export const sendToChannel = async (options: {
  channel_id: string;
  token: string;
  content?: string;
  embeds?: DiscordEmbed[];
  components?: DiscordComponent[];
  files?: unknown;
}) => {
  const { channel_id } = options;
  const endpoint = Routes.channelMessages(channel_id);
  return toDiscordEndpoint(endpoint, {
    method: "POST",
    body: {
      content: options?.content,
      embeds: options?.embeds,
      components: options?.components,
      files: options?.files
    },
    headers: { Authorization: `Bot ${options.token}` }
  });
};
