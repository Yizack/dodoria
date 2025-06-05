import type { H3Event } from "h3";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

export const handleKickWebhook = async (event: H3Event, body: KickWebhookBody) => {
  const { broadcaster, banned_user, metadata, moderator } = body;
  const config = useRuntimeConfig(event);
  const db = useDB();
  const kick = useKickApi(config.kick.clientId, config.kick.clientSecret);
  const now = new Date();

  if (!broadcaster || !banned_user || !metadata || !moderator) return;

  const liveStream = await kick.getLiveStream(broadcaster.user_id);
  const isBanned = !metadata.expires_at;
  const timeoutUntil = metadata.expires_at ? new Date(metadata.expires_at) : null;
  const duration = timeoutUntil ? intervalToDuration({ start: now, end: timeoutUntil }) : null;
  const fixedDuration = duration ? duration.days ? { days: duration.days, hours: duration.hours } : { hours: duration.hours, minutes: duration.minutes, seconds: duration.seconds } : null;
  const formattedDuration = fixedDuration ? formatDuration(fixedDuration, { format: ["days", "hours", "minutes", "seconds"], locale: es }) : null;
  const messageHelper = isBanned ? "ha sido baneado permanentemente" : `ha recibido un timeout de ${formattedDuration}`;

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

  await sendToChannel({
    content: `## ${socials.kick} \`${banned_user.username}\` ${messageHelper}. <:pepoPoint:712364175967518730>${streamMessageHelper}`,
    channel_id,
    token: config.discord.token
  }).catch(() => null);

  await db.insert(tables.kickBans).values({
    username: banned_user.username,
    actionBy: moderator.username,
    type: "ban",
    expiresAt: timeoutUntil?.getTime()
  }).returning().get().catch(() => null);

  return true;
};
