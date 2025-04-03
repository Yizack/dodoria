import type { NitroFetchOptions } from "nitropack";

export class Botrix {
  private static BASE_URL = "https://botrix.live//api";
  private static STREAMER = "angar";
  private static PLATFORM = "kick";

  constructor (private options?: { bypassCache?: boolean }) {}

  protected async _fetch<T>(path: string, options?: NitroFetchOptions<"json">) {
    return $fetch<T>(path, {
      baseURL: Botrix.BASE_URL,
      ...options,
      query: {
        user: Botrix.STREAMER,
        platform: Botrix.PLATFORM,
        ...options?.query
      }
    });
  }

  public async getLeaderboard (options?: { search?: string }): Promise<BotrixUser[]> {
    return this._fetch<BotrixUser[]>("/public/leaderboard", {
      query: {
        user: "angar",
        platform: "kick",
        search: options?.search,
        t: this.options?.bypassCache ? Date.now() : undefined
      }
    }).catch(() => []);
  }

  public async getUser (name: string) {
    const leaderboard = await this.getLeaderboard({ search: name });
    return leaderboard.find(user => user.name.toLowerCase() === name.toLowerCase());
  }
}
