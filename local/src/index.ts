/* eslint-disable no-case-declarations */
import { Events } from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import { hash } from "ohash";
import { $fetch } from "ofetch";
import { Kick } from "./clients/kick";
import { Discord } from "./clients/discord";
import { Kickbot } from "./clients/kickbot";
import { mp3ToOgg } from "./utils/mp3-to-ogg";

const kickChannel = await Kick.getChannel("yizack");

const ttsMessages: TTSMessage[] = [];

Discord.client.on(Events.MessageCreate, async (message) => {
  const { content, channelId, author } = message;
  const split = content.split(" ");
  const command = split[0]!.toLowerCase();
  const text = split.slice(1).join(" ");

  switch (command) {
    case "!ttsraw":
    case "!tts":
      if (channelId !== "610323743155421194" && channelId !== "1048659746137317498") return;
      const chat = await Kick.client.api.chat.sendMessage(kickChannel.chatroomId, text).catch((e) => {
        console.warn(e);
        return null;
      });

      if (!chat) return;
      ttsMessages.push({
        raw: command === "!ttsraw",
        text,
        username: author.username,
        channelId,
        guildId: message.guildId,
        messageId: message.id
      });
      break;
  }
});

Kickbot.subscribe(kickChannel.id);

Kickbot.client.onmessage = async (message) => {
  const event: KickbotEvent = JSON.parse(message.data.toString());
  const { data } = event;
  if (data.event_type !== "TTS_MESSAGE" || data.payload.viewer_username !== Kick.user.username) return;
  const text = `!${data.payload.command} ${data.payload.message}`;
  const tts = ttsMessages.find(tts => tts.text === text);
  if (!tts) return;

  const audioStream = await $fetch(data.payload.audio_url, {
    responseType: "stream"
  });

  const audioOgg = await mp3ToOgg(audioStream);
  console.info(`${tts.username}:`, tts.text);

  const sendEndpoint = `https://discord.com/api/v10/channels/${tts.channelId}/messages`;

  const filename = `${hash(text)}.ogg`;
  const files = [{ name: filename, file: audioOgg.blob }];
  const body = {
    flags: tts.raw ? undefined : MessageFlags.IsVoiceMessage,
    message_reference: {
      message_id: tts.messageId,
      channel_id: tts.channelId,
      guild_id: tts.guildId
    },
    attachments: [
      {
        id: 0,
        filename: filename,
        duration_secs: 10,
        waveform: "acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg=="
      }
    ]
  };

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`files[${i}]`, files[i]!.file, files[i]!.name);
  }
  formData.append("payload_json", JSON.stringify(body));

  await $fetch(sendEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bot ${Discord.token}`
    },
    onResponseError: ({ response }) => {
      console.warn(response._data);
    }
  });

  ttsMessages.splice(ttsMessages.indexOf(tts), 1);
};
