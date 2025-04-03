export {};

declare global {
  interface BotrixUser {
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
}
