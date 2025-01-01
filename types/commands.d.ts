export {};

declare global {
  interface Command {
    name: string;
    description: string;
    options?: {
      name: string;
      description: string;
      type: number;
      required?: boolean;
      choices?: { name: string, value: string }[];
    }[];
    integration_types?: number[];
    contexts?: number[];
    cid: string;
  }
}
