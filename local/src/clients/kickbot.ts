import { WebSocket } from "ws";

const socketURL = "wss://kickbot.live/ws";
let client = new WebSocket(socketURL);

const subscribe = (channelId: number) => {
  client.once("open", () => {
    console.info("Connected to KickBot server");
    const info = JSON.stringify({ type: "subscribe", channel: `kb${channelId}` });
    client.send(info);
    console.info("Subscribed to KickBot channel events");
  });
};

const reconnect = (channelId: number) => {
  console.info("Disconnected from KickBot server");
  console.info("Trying to reconnect to KickBot server...");
  client = new WebSocket(socketURL);
  client.once("open", () => {
    console.info("Reconnected to KickBot server");
    subscribe(channelId);
  });
};

export const KickBot = {
  client,
  subscribe,
  reconnect
};
