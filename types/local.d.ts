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
    codecData: {
      format: string;
      audio: string;
      audio_details: string[];
      video: string;
      video_details: string[];
      duration: string;
    } | null;
  }
}
