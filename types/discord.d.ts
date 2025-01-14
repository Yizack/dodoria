export {};

declare global {
  interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  }

  interface DiscordMember {
    avatar: string | null;
    user: DiscordUser;
    roles: string[];
    joined_at: string;
    permissions: string;
    nick: string | null;
  }

  interface WebhookBody {
    type: number;
    id: string;
    data: {
      name: string;
      options: {
        type: number;
        name: string;
        value: string;
      }[] | null;
      resolved: {
        users: Record<string, DiscordUser>;
        members: Record<string, Omit<DiscordMember, "user">>;
      } | null;
      custom_id?: string;
    };
    user: DiscordUser;
    member: DiscordMember;
    guild_id: string;
    channel_id: string;
    token: string;
    context: 0 | 1 | 2;
    message: DiscordMessage;
    embeds: DiscordEmbed[];
  }

  interface DiscordEmbed {
    type?: string;
    title?: string;
    description?: string;
    color?: number;
    url?: string;
    image?: {
      url: guide;
    };
    author?: {
      name: string;
      icon_url: string;
    };
    thumbnail?: {
      url: string;
    };
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
    footer?: {
      text?: string;
      icon_url?: string;
    };
  }

  interface DiscordButton {
    type: number;
    style: number;
    label?: string;
    url?: string;
    custom_id?: string;
    emoji?: {
      id: string;
      name: string;
    };
    disabled?: boolean;
  }

  interface DiscordComponent {
    type: number;
    components: DiscordButton[];
  }

  interface DiscordMessage {
    application_id: string;
    attachments: unknown[];
    author: DiscordUser;
    channel_id: string;
    components: DiscordComponent[];
    content: string;
    edited_timestamp: string | null;
    embeds: DiscordEmbed[];
    flags: number;
    id: string;
    interaction?: {
      id: string;
    };
  }

  interface AuditLogEntries {
    target_id: string;
    changes?: {
      key: string;
      old_value?: string;
      new_value?: string;
    }[];
    user_id: string;
    id: string;
    action_type: number;
  }

  interface AuditLog {
    audit_log_entries: AuditLogEntries[];
    users: DiscordUser[];
  }

  interface DiscordVoiceBody {
    flags?: MessageFlags;
    message_reference?: {
      message_id: string;
      channel_id: string;
      guild_id: string | null;
    };
    attachments: {
      id: number;
      filename: string;
      duration_secs?: number;
      waveform?: string;
    }[];
  }
}
