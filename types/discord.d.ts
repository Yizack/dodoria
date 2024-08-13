export {};

declare global {
  interface WebhookBody {
    type: number;
    data: {
      name: string;
      options: Record<string, string>[] | null;
      resolved: {
        users: Record<string, { username: string, avatar: string, discriminator: string }>;
      };
    };
    member: {
      user: {
        id: string;
        username: string;
        avatar: string;
      };
    };
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
