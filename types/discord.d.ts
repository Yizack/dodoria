export {};

declare global {
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
      icon_url: string;
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
