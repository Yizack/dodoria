import { WebSocket } from "ws";

const socketURL = "wss://kickbot.live/ws";
let client = new WebSocket(socketURL);

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
  console.info("Trying to reconnect to KickBot server...");
  client = new WebSocket(socketURL);
};

export const KickBot = {
  client,
  subscribe
};
