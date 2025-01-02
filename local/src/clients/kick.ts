import { Kient } from "kient";
import OTP from "otp";
import { useLocalConfig } from "../utils/config";

const { kick2FA, kickPassword, kickEmail } = useLocalConfig();

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

const getChannel = (name: string) => {
  console.info(`Getting Kickbot channel for ${name}`);
  switch (name.toLowerCase()) {
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
      return client.api.channel.getChannel(name).then((channel) => {
        return {
          id: channel.data.id,
          chatroomId: channel.data.chatroom.id
        };
      });
  }
};

export const Kick = {
  client,
  user,
  getChannel
};
