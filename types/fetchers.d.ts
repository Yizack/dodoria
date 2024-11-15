export {};

declare global {
  interface VideoScrapping {
    id: string;
    video_url: string;
    short_url: string;
    status: number;
    caption: string;
    format?: string;
    is_photo?: boolean;
  }

  interface LOLRank {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }

  interface LOLMatch {
    win: boolean;
    remake: boolean;
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    queueName: string;
    strTime: string;
    summoner1Id: number;
    summoner2Id: number;
  }
}
