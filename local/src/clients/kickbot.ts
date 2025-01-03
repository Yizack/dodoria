import { WebSocket } from "ws";

const client = new WebSocket("wss://kickbot.live/ws");

client.onopen = () => {
  console.info("Connected to KickBot server");
};

const subscribe = (channelId: number) => {
  const info = JSON.stringify({ type: "subscribe", channel: `kb${channelId}` });
  client.send(info);
  console.info("Subscribed to KickBot channel events");
};

client.onclose = () => {
  console.info("Disconnected from KickBot server");
};

export const KickBot = {
  client,
  subscribe
};
