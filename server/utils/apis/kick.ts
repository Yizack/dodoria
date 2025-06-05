import { stringifyQuery } from "ufo";

class kickApi {
  clientId: string;
  clientSecret: string;
  baseURL: string;
  tokenURL: string;
  constructor (clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseURL = "https://api.kick.com";
    this.tokenURL = "https://id.kick.com/oauth/token";
  }

  async getAppAccessToken (): Promise<string | undefined> {
    const { access_token } = await $fetch<{ access_token: string }>(this.tokenURL, {
      method: "POST",
      body: stringifyQuery({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    if (!access_token) {
      console.info("Failed to retrieve access token from Kick API");
      return;
    }
    return access_token;
  }

  async getLiveStream (broadcasterId: number): Promise<KickLiveStream | undefined> {
    const accessToken = await this.getAppAccessToken();
    if (!accessToken) return;
    const { data } = await $fetch<{ data: KickLiveStream[] }>(`${this.baseURL}/public/v1/livestreams`, {
      query: { broadcaster_user_id: broadcasterId },
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!data.length) {
      console.info(`Failed to retrieve live stream for broadcaster ID ${broadcasterId}`);
      return;
    }
    return data[0];
  }
}

export const useKickApi = (clientId: string, clientSecret: string): kickApi => {
  return new kickApi(clientId, clientSecret);
};
