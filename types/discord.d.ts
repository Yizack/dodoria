export {};

declare global {
  interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  };

  interface DiscordMember {
    avatar: string | null;
    user: DiscordUser;
    roles: string[];
    joined_at: string;
    permissions: string;
    nick: string | null;
  };

  interface WebhookBody {
    type: number;
    data: {
      name: string;
      options: {
        type: number;
        name: string;
        value: string;
      }[] | null;
      resolved: {
        users: Record<string, DiscordUser>;
        members: Record<string, DiscordMember>;
      };
    };
    member: DiscordMember;
    guild_id: string;
    channel_id: string;
    token: string;
  }

  interface DiscordEmbed {
    type?: string;
    title?: string;
    description?: string;
    color?: number;
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
    label: string;
    url: string;
  }

  interface DiscordComponent {
    type: number;
    components: DiscordButton[];
  }
}
