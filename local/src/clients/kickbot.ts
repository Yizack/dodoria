import { WebSocket } from "ws";

const client = new WebSocket("wss://kickbot.live/ws");
// const kickbotId = false ? "kb32694" : "kb34243";

client.onopen = () => {
  console.info("Connected to Kickbot server");
};

const subscribe = (channelId: number) => {
  const info = JSON.stringify({ type: "subscribe", channel: `kb${channelId}` });
  client.send(info);
  console.info(`Subscribed to Kickbot channel kb${channelId} events`);
};

export const Kickbot = {
  client,
  subscribe
};
