/* eslint-disable no-case-declarations */
import { Events, type TextChannel } from "discord.js";
import { AuditLogEvent, MessageFlags } from "discord-api-types/v10";
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
import { queryD1, tables, useDB } from "./utils/database";

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
  "bananero", "serrano", "lulu", "babidi", "maka", "buu", "mocoso",
  "orco2", "paisana", "melco"
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
      if (!allowedDiscordChannels.includes(channelId) || !textHasMessage) return;

      const isLive = await Kick.isLive();
      if (isLive) {
        message.reply("No puedes enviar tts mientras ANGAR está en directo.");
        return;
      }

      const voice = text.split(" ")[0]!.toLowerCase().replace("!", "");
      if (!text.startsWith("!") || !availableVoices.includes(voice)) return;
      if (text.length > 300) {
        message.reply("El mensaje es muy largo, no puede contener más de 300 caracteres.");
        return;
      }
      await Kick.refreshToken();
      const chat = await Kick.api.chat.send({ message: text, type: "user", userId: kickChannel.broadcasterId }).catch((e) => {
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
  const now = Date.now();
  const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
  const newTimeout = newMember.communicationDisabledUntilTimestamp;
  const { guild } = newMember;
  const channel = await Discord.client.channels.fetch(discordChannels.general) as TextChannel;
  const channelNotDodoritos = await Discord.client.channels.fetch("1379439298503250013") as TextChannel;
  if (guild.id !== "607559322175668248" || oldTimeout === newTimeout) return;
  if (newTimeout && newTimeout > now) {
    const duration = intervalToDuration({ start: new Date(now), end: new Date(newTimeout) });
    const fixedDuration = duration ? duration.days ? { days: duration.days, hours: duration.hours } : { hours: duration.hours, minutes: duration.minutes, seconds: duration.seconds } : null;
    const formattedDuration = fixedDuration ? formatDuration(fixedDuration, { format: ["days", "hours", "minutes", "seconds"], locale: es }) : null;
    const pepoPoint = "<:pepoPoint:712364175967518730>";
    await channel.send(`## ${socials.discord} \`${newMember.displayName} (${newMember.user.username})\` ha recibido un timeout de ${formattedDuration}. ${pepoPoint}`);

    const auditLogs = await guild.fetchAuditLogs({ limit: 100, type: AuditLogEvent.MemberUpdate });
    const logEntry = auditLogs.entries.find(entry => entry.targetId === newMember.id && entry?.changes?.some(change => change.key === "communication_disabled_until" && change.new === new Date(newTimeout).toISOString()));
    const moderator = logEntry?.executor;
    const moderatorName = moderator ? ` por ${moderator?.displayName} (${moderator?.username})` : "";
    await channelNotDodoritos.send(`## ${socials.discord} \`${newMember.displayName} (${newMember.user.username})\` ha recibido un timeout de ${formattedDuration}${moderatorName}. ${pepoPoint}`);
  }
  else if (oldTimeout && !newTimeout && oldTimeout > now) {
    await channel.send(`## ${socials.discord} \`${newMember.displayName} (${newMember.user.username})\` ha sido liberado de la prisión de los basados. <:Chadge:1225320321507135630>`);
  }
});

KickBot.subscribe(kickChannel.id);
KickBot.client.onclose = () => KickBot.reconnect(kickChannel.id);
KickBot.client.onmessage = async (message) => {
  const event: KickbotEvent = JSON.parse(message.data.toString());
  const { data } = event;
  if (data.event_type !== "TTS_MESSAGE" || data.payload.viewer_username.toLowerCase() !== Kick.user.slug.toLowerCase()) return;
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

Kick.client.on(Kick.Events.Chatroom.UserUnbanned, async (event) => {
  const { data } = event;

  // Send to D1
  const query = useDB().insert(tables.kickBans).values({
    username: data.user.username,
    actionBy: data.unbanned_by.username,
    type: "unban"
  }).toSQL();

  await queryD1(query);
});
