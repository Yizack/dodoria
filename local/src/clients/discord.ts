import { Client, Events, GatewayIntentBits } from "discord.js";
import { $fetch } from "ofetch";
import { useLocalConfig } from "../utils/config";

const { discordToken } = useLocalConfig();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
] });

client.on(Events.ClientReady, async () => {
  if (!client.user) throw new Error("Discord Client user not found");
  console.info(`Logged in on Discord as ${client.user.tag}!`);
});

client.login(discordToken);

const replyVoiceMessage = async (files: { name: string, file: Blob }[], body: DiscordVoiceBody, raw: boolean = false) => {
  const channelId = body.message_reference!.channel_id;
  const sendEndpoint = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`files[${i}]`, files[i]!.file, files[i]!.name);
  }

  if (raw) {
    delete body.flags;
    if (!body.attachments[0]) throw new Error("Attachment not found");
    delete body.attachments[0].waveform;
    delete body.attachments[0].duration_secs;
  }

  formData.append("payload_json", JSON.stringify(body));

  let isReferenced = true;
  const response = await $fetch(sendEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bot ${Discord.token}`
    },
    onResponseError: ({ response }) => {
      isReferenced = Boolean(!response._data.errors.message_reference);
      console.warn(response._data);
    }
  }).catch(() => null);

  if (!response && !isReferenced) {
    console.info("Sending message without reference");
    delete body.message_reference;
    formData.delete("payload_json");
    formData.append("payload_json", JSON.stringify(body));
    await $fetch(sendEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bot ${Discord.token}`
      },
      onResponseError: async ({ response }) => {
        console.warn(response._data);
      }
    }).catch(() => null);
  }
};

const defaultWaveform = "acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg==";

export const Discord = {
  client,
  token: discordToken,
  defaultWaveform,
  replyVoiceMessage
};
