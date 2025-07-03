import { stringifyQuery } from "ufo";
import type { H3Event } from "h3";
import type { TokenDataParams } from "kient";

interface KickAPIConfig {
  clientId?: string;
  clientSecret?: string;
}

class kickApi {
  baseURL: string;
  tokenURL: string;
  userAccessToken?: string;
  constructor (private config: KickAPIConfig) {
    this.baseURL = "https://api.kick.com";
    this.tokenURL = "https://id.kick.com/oauth/token";
  }

  async getAppAccessToken (): Promise<string | undefined> {
    const response = await $fetch<{ access_token: string }>(this.tokenURL, {
      method: "POST",
      body: stringifyQuery({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(() => null);
    if (!response) {
      console.info("Failed to retrieve access token from Kick API");
      return;
    }
    const { access_token } = response;
    return access_token;
  }

  async getLiveStream (broadcasterId: number): Promise<KickLiveStream | undefined> {
    const accessToken = await this.getAppAccessToken();
    if (!accessToken) return;
    const response = await $fetch<{ data: KickLiveStream[] }>("/public/v1/livestreams", {
      baseURL: this.baseURL,
      query: { broadcaster_user_id: broadcasterId },
      headers: { Authorization: `Bearer ${accessToken}` }
    }).catch(() => null);
    if (!response || (response && !response.data.length)) {
      console.info(`Failed to retrieve live stream for broadcaster ID ${broadcasterId}`);
      return;
    }
    const { data } = response;
    return data[0];
  }

  async refreshUserToken (event: H3Event) {
    const key = "kick-refresh-token";
    const kvString = await event.context.cloudflare.env.CACHE.get(key);
    const kv = kvString ? JSON.parse(kvString) as { value: TokenDataParams & { updatedAt: number } } : null;

    if (!kv) return;
    const currentTime = Date.now();
    const tokenAge = (currentTime - kv.value.updatedAt) / 1000;
    const isExpired = tokenAge > kv.value.expiresIn;

    if (!isExpired) {
      console.info(`Using cached Kick token, will expire in ${kv.value.expiresIn - tokenAge} seconds`);
      this.userAccessToken = kv.value.accessToken;
      return;
    }

    console.info("Kick token expired, refreshing...");

    const refresh = await $fetch<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
      scope: string;
    }>(this.tokenURL, {
      method: "POST",
      body: stringifyQuery({
        grant_type: "refresh_token",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: kv.value.refreshToken
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(() => {});

    if (!refresh) return;

    const token: TokenDataParams & { updatedAt: number } = {
      accessToken: refresh.access_token,
      tokenType: "Bearer",
      refreshToken: refresh.refresh_token,
      expiresIn: refresh.expires_in,
      scope: refresh.scope,
      updatedAt: currentTime
    };

    event.waitUntil(
      event.context.cloudflare.env.CACHE.put(key, JSON.stringify({ value: token }))
    );

    this.userAccessToken = token.accessToken;
  }

  async sendToChat (broadcasterId: number, message: string) {
    if (!this.userAccessToken) {
      console.warn("User access token is not set");
    }

    return $fetch("/public/v1/chat", {
      baseURL: this.baseURL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.userAccessToken}`
      },
      body: {
        broadcaster_user_id: broadcasterId,
        content: message,
        type: "user"
      }
    }).catch(() => {});
  }
}

export const useKickApi = (config: KickAPIConfig): kickApi => {
  return new kickApi(config);
};
