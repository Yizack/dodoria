import { Kient, KientUserTokenAuthentication, type TokenDataParams } from "kient";
import { Events, Kient as OldKient } from "@ahmedrangel/kient";
import { useLocalConfig } from "../utils/config";
import { getKV, putKV } from "../utils/kv";

const { kickClientId, kickClientSecret, kickChatChannel } = useLocalConfig();

const kient = new Kient();
if (!kickClientId) throw new Error("Missing KICK_CLIENT_ID");
if (!kickClientSecret) throw new Error("Missing KICK_CLIENT_SECRET");

const authentication = new KientUserTokenAuthentication({
  clientId: kickClientId,
  clientSecret: kickClientSecret,
  redirectUri: ""
});

const refreshToken = async () => {
  const key = "kick-refresh-token";
  const kv = await getKV<TokenDataParams & { updatedAt: number }>(key);
  const currentTime = Date.now();
  const tokenAge = (currentTime - kv.value.updatedAt) / 1000;
  const isExpired = tokenAge > kv.value.expiresIn;

  if (!isExpired) {
    console.info(`Using cached Kick token, will expire in ${kv.value.expiresIn - tokenAge} seconds`);
    return kient.setAuthToken(kv.value.accessToken);
  }

  console.info("Kick token expired, refreshing...");
  const token = await authentication.refeshToken({ refreshToken: kv.value.refreshToken! });
  await putKV(key, { ...token, updatedAt: currentTime });
  return kient.setAuthToken(token.accessToken);
};

await refreshToken();

const client = await OldKient.create();
const user = await kient.api.channel.getAuthorisedUser();

console.info(`Connected to Kient client for KICK as ${user.slug}`);

const getChannel = (name?: string) => {
  const channelName = name || kickChatChannel || "";
  console.info(`Getting Kick channel for ${channelName}`);
  switch (channelName.toLowerCase()) {
    case "angar":
      return {
        id: 32694,
        broadcasterId: 12115552,
        chatroomId: 11183564
      };
    case "yizack":
      return {
        id: 34243,
        broadcasterId: 15502718,
        chatroomId: 14527954
      };
    default:
      return client.api.channel.getChannel(channelName).then((channel) => {
        return {
          id: channel.data.id,
          broadcasterId: channel.data.user_id,
          chatroomId: channel.data.chatroom.id
        };
      });
  }
};

const getBans = async (name: string) => {
  const channelName = name || kickChatChannel || "";
  console.info(`Getting Kick bans for ${channelName}`);
  return client.api.channel.getBans(channelName).then(channel => channel.data);
};

const subscribe = (roomId: number) => {
  client.ws.chatroom.listen(roomId);
  console.info("Subscribed to Kick channel events");
};

const isLive = async () => {
  if (!kickChatChannel) return false;
  return kient.api.channel.getBySlug(kickChatChannel).then((channel) => {
    return channel.stream.isLive;
  }).catch(() => false);
};

export const Kick = {
  client,
  api: kient.api,
  user,
  getChannel,
  isLive,
  getBans,
  subscribe,
  refreshToken,
  Events
};
