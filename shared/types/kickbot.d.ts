export {};

declare global {
  interface KickbotEvent {
    channel: string;
    data: {
      event_type: string;
      payload: {
        id: number;
        command: string;
        viewer_username: string;
        streamer: number;
        voice: string;
        message: string;
        audio_url: string;
        voice_obj: number;
        voice_label: string;
        voice_image: string;
      };
    };
  }
}
