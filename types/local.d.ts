export {};

declare global {
  interface TTSMessage {
    raw: boolean;
    text: string;
    username: string;
    channelId: string;
    guildId: string | null;
    messageId: string;
  }

  interface OggConversion {
    blob: Blob;
    metadata: {
      duration: number | null;
    };
  }
}
