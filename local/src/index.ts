/* eslint-disable no-case-declarations */
import { Events, type TextChannel } from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import { hash } from "ohash";
import { $fetch } from "ofetch";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";
import { Kick } from "./clients/kick";
import { Discord } from "./clients/discord";
import { KickBot } from "./clients/kickbot";
import { mp3ToOgg } from "./utils/mp3-to-ogg";
import { findMostSimilar } from "./utils/levenshtein";
import { startApiServer } from "./clients/router";

startApiServer();
const kickChannel = await Kick.getChannel();
const allowedChannels = [
  "1048659746137317498", // tests
  "610323743155421194", // general
  "800811897804292138" // copys
];
const availableVoices = [
  "tilin", "angar", "chino", "lotrial", "dross", "temach",
  "dalas", "yuki", "pichu", "jh", "juan", "canser", "ari",
  "shita", "pablo", "xokas", "dbz", "doc", "camilo", "viendo",
  "coscu", "messi", "orco", "shrek", "mura", "arthas"
];
let ttsMessages: TTSMessage[] = [];

Discord.client.on(Events.MessageCreate, async (message) => {
  const { content, channelId, author } = message;
  const split = content.split(" ");
  const command = split[0]!.toLowerCase();
  const text = split.slice(1).join(" ");
  const textHasMessage = text.split(" ").length > 1;

  switch (command) {
    case "!ttsraw":
    case "!tts":
      if (!textHasMessage) return;
      const voice = text.split(" ")[0]!.toLowerCase().replace("!", "");
      if (!allowedChannels.includes(channelId) || !text.startsWith("!") || !availableVoices.includes(voice) || !textHasMessage) return;
      if (text.length > 300) {
        message.reply("El mensaje es muy largo, no puede contener más de 300 caracteres.");
        return;
      }
      const chat = await Kick.client.api.chat.sendMessage(kickChannel.chatroomId, text).catch((e) => {
        console.warn(e);
        return null;
      });
      if (!chat) return;
      message.channel.sendTyping();
      ttsMessages.push({
        raw: command === "!ttsraw",
        text: text.toLowerCase(),
        username: author.username,
        channelId,
        guildId: message.guildId,
        messageId: message.id,
        createdAt: message.createdTimestamp
      });
      for (const [i, tts] of ttsMessages.entries()) {
        if (message.createdTimestamp - tts.createdAt > 300000) { // 5 minutes
          ttsMessages.splice(i, 1);
        }
      }
      break;
  }
});

KickBot.subscribe(kickChannel.id);

KickBot.client.onmessage = async (message) => {
  const event: KickbotEvent = JSON.parse(message.data.toString());
  const { data } = event;
  if (data.event_type !== "TTS_MESSAGE" || data.payload.viewer_username !== Kick.user.username) return;
  const text = `!${data.payload.command} ${data.payload.message}`;
  const mostSimilarText = findMostSimilar(text, ttsMessages.map(tts => tts.text));
  const tts = ttsMessages.find(tts => tts.text === mostSimilarText);
  if (!tts) return;

  const audioStream = await $fetch(data.payload.audio_url, {
    responseType: "stream"
  });

  const ogg = await mp3ToOgg(audioStream).catch((e) => {
    console.warn(e);
    return null;
  });
  if (!ogg) return;
  console.info(`${tts.username}:`, tts.text);

  const sendEndpoint = `https://discord.com/api/v10/channels/${tts.channelId}/messages`;

  const filename = `${hash(text)}.ogg`;
  const files = [{ name: filename, file: ogg.blob }];
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
        duration_secs: ogg.metadata.duration || 10,
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
  ttsMessages = ttsMessages.filter(tts => tts.text !== text);
};

Kick.subscribe(kickChannel.chatroomId);
Kick.client.on(Kick.Events.Chatroom.UserBanned, async (event) => {
  const { data } = event;
  try {
    const channel = await Discord.client.channels.fetch("610323743155421194") as TextChannel;
    const isBanned = !data.expires_at;
    const timeoutUntil = data.expires_at;
    const duration = timeoutUntil ? intervalToDuration({ start: new Date(Date.now()), end: timeoutUntil }) : null;
    const formattedDuration = duration ? formatDuration(duration, { format: ["days", "hours", "minutes", "seconds"], locale: es }) : null;
    const messageHelper = isBanned ? "ha sido baneado permanentemente" : `ha recibido un timeout de ${formattedDuration}`;
    console.info(`${data.user.username} ${messageHelper} por ${data.banned_by.username}`);
    channel.send(`## <:kick:1267449535668555788> \`${data.user.username}\` ${messageHelper}. <:pepoPoint:712364175967518730>`);
  }
  catch (error) {
    console.info("Error al enviar el mensaje a Discord:", error);
  }
});
