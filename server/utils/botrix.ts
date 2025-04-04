import type { NitroFetchOptions } from "nitropack";

export class BotRix {
  private static BASE_URL = "https://botrix.live//api";
  private static STREAMER = "angar";
  private static PLATFORM = "kick";

  constructor (private options?: { bypassCache?: boolean }) {}

  protected async _fetch<T>(path: string, options?: NitroFetchOptions<"json">) {
    return $fetch<T>(path, {
      baseURL: BotRix.BASE_URL,
      ...options,
      query: {
        user: BotRix.STREAMER,
        platform: BotRix.PLATFORM,
        ...options?.query
      }
    });
  }

  public async getLeaderboard (options?: { search?: string, sort?: "points" | "watchtime" }): Promise<BotRixUser[]> {
    return this._fetch<BotRixUser[]>("/public/leaderboard", {
      query: {
        user: "angar",
        platform: "kick",
        search: options?.search,
        mode: options?.sort || "points",
        t: this.options?.bypassCache ? Date.now() : undefined
      }
    }).catch(() => []);
  }

  public async getUser (name: string) {
    const leaderboard = await this.getLeaderboard({ search: name });
    return leaderboard.find(user => user.name.toLowerCase() === name.toLowerCase());
  }
}
