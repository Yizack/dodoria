export {};

declare global {
  interface BotRixUser {
    level: number;
    watchtime: number;
    xp: number;
    points: number;
    name: string;
    followage: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
  }

  interface BotRixUserWithRank extends BotRixUser {
    rank: number;
  }

  interface BotRixCachedLeaderboard {
    values: BotRixUserWithRank[];
    pageSize: number;
    timestamp: string;
  }
}
