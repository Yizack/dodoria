import { WebSocket } from "ws";

const socketURL = "wss://kickbot.live/ws";
let client = new WebSocket(socketURL);

client.once("open", () => {
  console.info("Connected to KickBot server");
});

const waitForOpenConnection = (socket: WebSocket) => {
  if (socket.readyState === WebSocket.OPEN) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    function onOpen () {
      cleanup();
      resolve();
    }
    function onError (err: WebSocket.ErrorEvent) {
      cleanup();
      reject(err);
    }
    function cleanup () {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("error", onError);
    }
    socket.addEventListener("open", onOpen);
    socket.addEventListener("error", onError);
  });
};

const subscribe = (channelId: number) => {
  waitForOpenConnection(client).then(() => {
    const info = JSON.stringify({ type: "subscribe", channel: `kb${channelId}` });
    client.send(info);
    console.info("Subscribed to KickBot channel events");
  }).catch((err) => {
    console.warn("Error subscribing to KickBot channel events:", err);
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
