export {};

declare global {
  interface KickUser {
    is_anonymous: boolean;
    user_id: number;
    username: string;
    is_verified: boolean | null;
    profile_picture: string;
    channel_slug: string;
    identity: string | null;
  }

  interface KickBanMetadata {
    reason: string;
    created_at: string;
    expires_at: string | null;
  }

  interface KickWebhookBody {
    broadcaster?: KickUser;
    moderator?: KickUser;
    banned_user?: KickUser;
    metadata?: KickBanMetadata;
  }

  interface KickLiveStream {
    broadcaster_user_id: number;
    category: {
      id: number;
      name: string;
      thumbnail: string;
    };
    channel_id: number;
    has_mature_content: boolean;
    language: string;
    slug: string;
    started_at?: string;
    stream_title: string;
    thumbnail: string;
    viewer_count: number;
  }
}
