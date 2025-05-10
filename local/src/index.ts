/* eslint-disable no-case-declarations */
import { Events, type TextChannel } from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import { hash } from "ohash";
import { $fetch } from "ofetch";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";
import { socials } from "./utils/emojis";
import { Kick } from "./clients/kick";
import { Discord } from "./clients/discord";
import { KickBot } from "./clients/kickbot";
import { mp3ToOgg } from "./utils/mp3-to-ogg";
import { findMostSimilar } from "./utils/levenshtein";
import { startApiServer } from "./clients/router";

startApiServer();
const kickChannel = await Kick.getChannel();
const discordChannels = {
  tests: "1048659746137317498",
  general: "610323743155421194",
  copys: "800811897804292138"
};
const allowedDiscordChannels = Object.values(discordChannels);
const availableVoices = [
  "tilin", "angar", "chino", "lotrial", "dross", "temach",
  "dalas", "yuki", "pichu", "jh", "juan", "canser", "ari",
  "shita", "pablo", "xokas", "dbz", "doc", "camilo", "viendo",
  "coscu", "messi", "orco", "shrek", "mura", "arthas", "emily",
  "bananero", "serrano", "lulu", "babidi", "maka", "buu", "mocoso"
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
      const livestream = await Kick.getLivestream();
      if (livestream && livestream.data) {
        message.reply("No puedes enviar tts mientras ANGAR está en directo.");
        return;
      }

      if (!textHasMessage) return;
      const voice = text.split(" ")[0]!.toLowerCase().replace("!", "");
      if (!allowedDiscordChannels.includes(channelId) || !text.startsWith("!") || !availableVoices.includes(voice) || !textHasMessage) return;
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
      ttsMessages = ttsMessages.filter(tts => message.createdTimestamp - tts.createdAt < 300000); // remove 5 minutes old
      break;
  }
});

Discord.client.on(Events.GuildBanAdd, async (event) => {
  const { user, guild } = event;
  if (guild.id !== "607559322175668248") return;
  const channel = await Discord.client.channels.fetch(discordChannels.general) as TextChannel;
  try {
    await channel.send(`## ${socials.discord} \`${user.displayName} (${user.username})\` ha sido baneado permanentemente. <:pepoPoint:712364175967518730>`);
  }
  catch (error) {
    console.info("Error al enviar el mensaje a Discord:", error);
  }
});

Discord.client.once(Events.ClientReady, async () => {
  // Populate the guild members cache
  const guild = await Discord.client.guilds.fetch("607559322175668248");
  await guild.members.fetch();
});

Discord.client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
  const newTimeout = newMember.communicationDisabledUntilTimestamp;
  const { guild } = newMember;
  const channel = await Discord.client.channels.fetch(discordChannels.general) as TextChannel;
  if (guild.id !== "607559322175668248" || oldTimeout === newTimeout) return;
  if (newTimeout && newTimeout > Date.now()) {
    const duration = intervalToDuration({ start: new Date(Date.now()), end: new Date(newTimeout) });
    const fixedDuration = duration ? duration.days ? { days: duration.days, hours: duration.hours } : { hours: duration.hours, minutes: duration.minutes, seconds: duration.seconds } : null;
    const formattedDuration = fixedDuration ? formatDuration(fixedDuration, { format: ["days", "hours", "minutes", "seconds"], locale: es }) : null;
    await channel.send(`## ${socials.discord} \`${newMember.displayName} (${newMember.user.username})\` ha recibido un timeout de ${formattedDuration}. <:pepoPoint:712364175967518730>`);
  }
  else if (oldTimeout && !newTimeout && oldTimeout > Date.now()) {
    await channel.send(`## ${socials.discord} \`${newMember.displayName} (${newMember.user.username})\` ha sido liberado de la prisión de los basados. <:Chadge:1225320321507135630>`);
  }
});

KickBot.subscribe(kickChannel.id);
KickBot.client.onclose = () => KickBot.reconnect(kickChannel.id);
KickBot.client.onmessage = async (message) => {
  const event: KickbotEvent = JSON.parse(message.data.toString());
  const { data } = event;
  if (data.event_type !== "TTS_MESSAGE" || data.payload.viewer_username !== Kick.user.username) return;
  const text = `!${data.payload.command} ${data.payload.message}`;
  const mostSimilarText = findMostSimilar(text, ttsMessages.map(tts => tts.text));
  const tts = ttsMessages.find(tts => tts.text === mostSimilarText);
  if (!tts) return;

  const audio: { name: string, duration?: number, file: Blob | null } = {
    name: `${hash(text)}.${tts.raw ? "mp3" : "ogg"}`,
    duration: 10,
    file: null
  };

  const audioBlob = await $fetch(data.payload.audio_url, {
    responseType: "blob"
  }).catch((e) => {
    console.warn(e);
    return null;
  });

  if (!audioBlob) return;

  if (!tts.raw) {
    const ogg = await mp3ToOgg(audioBlob.stream()).catch((e) => {
      console.warn(e);
      return null;
    });
    if (!ogg) return;
    audio.file = ogg.blob;
    if (ogg.metadata.duration) {
      audio.duration = ogg.metadata.duration;
    }
  }
  else {
    audio.file = audioBlob;
  }

  const files = [{ name: audio.name, file: audio.file }];
  console.info(`${tts.username}:`, tts.text);
  await Discord.replyVoiceMessage(files, {
    flags: MessageFlags.IsVoiceMessage,
    message_reference: { message_id: tts.messageId, channel_id: tts.channelId, guild_id: tts.guildId },
    attachments: [{
      id: 0,
      filename: audio.name,
      duration_secs: audio.duration,
      waveform: Discord.defaultWaveform
    }]
  }, tts.raw);
  ttsMessages = ttsMessages.filter(tts => tts.text !== mostSimilarText);
};

Kick.subscribe(kickChannel.chatroomId);
Kick.client.on(Kick.Events.Chatroom.UserBanned, async (event) => {
  const { data } = event;
  try {
    const channel = await Discord.client.channels.fetch(discordChannels.general) as TextChannel;
    const kickLiveStream = await Kick.getLivestream();
    const isBanned = !data.expires_at;
    const timeoutUntil = data.expires_at;
    const now = new Date();
    const duration = timeoutUntil ? intervalToDuration({ start: now, end: timeoutUntil }) : null;
    const fixedDuration = duration ? duration.days ? { days: duration.days, hours: duration.hours } : { hours: duration.hours, minutes: duration.minutes } : null;
    const formattedDuration = fixedDuration ? formatDuration(fixedDuration, { format: ["days", "hours", "minutes"], locale: es }) : null;
    const messageHelper = isBanned ? "ha sido baneado permanentemente" : `ha recibido un timeout de ${formattedDuration}`;

    let streamMessageHelper = "";
    const startedDate = kickLiveStream?.data?.created_at;
    if (kickLiveStream && startedDate) {
      // restar 20 segundos al now por el delay
      const fixedNow = new Date(now.getTime() - 20000);
      const diff = Math.abs(fixedNow.getTime() - new Date(startedDate).getTime());
      const diffInMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.floor(diffInMinutes % 60);
      const seconds = Math.floor(diffInMinutes % 60);
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      streamMessageHelper = `\n:watch:  ~\`${formattedTime}\` del stream.`;
    }

    console.info(`${data.user.username} ${messageHelper} por ${data.banned_by.username}`);
    await Kick.client.api.chat.sendMessage(kickChannel.chatroomId, `@${data.user.username}${messageHelper}`).catch(() => null);
    await channel.send(`## ${socials.kick} \`${data.user.username}\` ${messageHelper}. <:pepoPoint:712364175967518730>${streamMessageHelper}`);
  }
  catch (error) {
    console.info("Error al enviar el mensaje a Discord:", error);
  }
});
