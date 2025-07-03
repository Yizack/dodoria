import type { H3Event } from "h3";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

export const handleKickWebhook = async (event: H3Event, body: KickWebhookBody) => {
  const now = new Date();
  const headers = getRequestHeaders(event);
  const kickEventMessageId = headers["kick-event-message-id"];
  const KV = event.context.cloudflare.env.CACHE;
  const processedKey = `kick-webhook-processed:${kickEventMessageId}`;
  const isProcessed = await KV.get(processedKey);
  if (Number(isProcessed)) {
    console.info(`Kick webhook already processed for message ID: ${kickEventMessageId}`);
    return true;
  }
  await KV.put(processedKey, "1", { expirationTtl: 60 });

  const { broadcaster, banned_user, metadata, moderator } = body;
  const config = useRuntimeConfig(event);
  const db = useDB();
  const kick = useKickApi({
    clientId: config.oauth.kick.clientId,
    clientSecret: config.oauth.kick.clientSecret
  });

  if (!broadcaster || !banned_user || !metadata || !moderator) return;

  const liveStream = await kick.getLiveStream(broadcaster.user_id);
  const isBanned = !metadata.expires_at;
  const timeoutUntil = metadata.expires_at ? new Date(metadata.expires_at) : null;
  const duration = timeoutUntil ? intervalToDuration({ start: now, end: timeoutUntil }) : null;
  const fixedDuration = duration ? duration.days ? { days: duration.days, hours: duration.hours } : { hours: duration.hours, minutes: duration.minutes, seconds: duration.seconds } : null;
  const formattedDuration = fixedDuration ? formatDuration(fixedDuration, { format: ["days", "hours", "minutes", "seconds"], locale: es }) : null;
  const messageHelper = isBanned ? "ha sido baneado permanentemente" : `ha recibido un timeout de ${formattedDuration}`;

  await db.insert(tables.kickBans).values({
    username: banned_user.username,
    actionBy: moderator.username,
    type: "ban",
    expiresAt: timeoutUntil?.getTime()
  }).returning().get();

  let streamMessageHelper = "";
  const startedDate = liveStream?.started_at;
  if (liveStream && startedDate) {
    const fixedNow = new Date(now.getTime() - 20000);
    const diff = Math.abs(fixedNow.getTime() - new Date(startedDate).getTime());
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    streamMessageHelper = `\n:watch:  ~\`${formattedTime}\` del stream.`;
  }

  console.info(`${banned_user.username} ${messageHelper} por ${moderator.username}`);

  const channel_id = broadcaster.channel_slug === "angar" ? CONSTANTS.CHANNEL_GENERAL : CONSTANTS.CHANNEL_PRUEBAS;
  const pepoPoint = "<:pepoPoint:712364175967518730>";

  await sendToChannel({
    content: `## ${socials.kick} \`${banned_user.username}\` ${messageHelper}. ${pepoPoint}${streamMessageHelper}`,
    channel_id,
    token: config.discord.token
  }).catch(() => null);

  await sendToChannel({
    content: `## ${socials.kick} \`${banned_user.username}\` ${messageHelper} por ${moderator.username}. ${pepoPoint}${streamMessageHelper}`,
    channel_id: "1379439298503250013",
    token: config.discord.token
  }).catch(() => null);

  await kick.refreshUserToken(event);
  await kick.sendToChat(broadcaster.user_id, `@${banned_user.username} ${messageHelper}`);

  return true;
};
