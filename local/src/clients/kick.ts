import { Kient } from "@ahmedrangel/kient";
import OTP from "otp";
import { useLocalConfig } from "../utils/config";

const { kick2FA, kickPassword, kickEmail, kickChatChannel } = useLocalConfig();

const client = await Kient.create();
const token = new OTP({ secret: kick2FA }).totp(Date.now());

if (!kickPassword || !kickEmail) throw new Error("Missing KICK_PASSWORD or KICK_EMAIL");

await client.api.authentication.login({
  email: kickEmail,
  password: kickPassword,
  otc: token
});

if (!client.authenticated) throw new Error("Failed to authenticate with Kient");

const user = await client.api.authentication.currentUser();
console.info(`Logged in on Kick as ${user.username}!`);

const getChannel = (name?: string) => {
  const channelName = name || kickChatChannel || "";
  console.info(`Getting Kick channel for ${channelName}`);
  switch (channelName.toLowerCase()) {
    case "angar":
      return {
        id: 32694,
        chatroomId: 11183564
      };
    case "yizack":
      return {
        id: 34243,
        chatroomId: 14527954
      };
    default:
      return client.api.channel.getChannel(channelName).then((channel) => {
        return {
          id: channel.data.id,
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

export const Kick = {
  client,
  user,
  getChannel,
  getBans
};
