export {};

declare global {
  interface BotrixLeaderboard {
    followage: {
      date: string;
    };
    level: number;
    name: string;
    points: number;
    watchtime: number;
    xp: number;
  }
}
