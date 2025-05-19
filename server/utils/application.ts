import { ApplicationWebhookEventType } from "discord-api-types/v10";

export const applicationHandler: ApplicationHandler = async (event, { body }) => {
  const config = useRuntimeConfig(event);
  if (body.event?.type === ApplicationWebhookEventType.ApplicationAuthorized) {
    const { data } = body.event;
    const { user, guild } = data;
    const avatarUrl = getAvatarURL({ userId: user.id, avatarHash: user.avatar });
    const message = guild ? `${user.username}, me ha instalado en el servidor ${guild.name} (${guild.id})` : `${user.global_name} (${user.username}), me ha instalado a sus aplicaciones!`;
    const embeds: DiscordEmbed[] = [{
      color: CONSTANTS.COLOR,
      author: {
        name: user.username,
        icon_url: avatarUrl
      },
      description: message,
      timestamp: new Date().toISOString()
    }];
    await sendToChannel({
      channel_id: CONSTANTS.CHANNEL_PRUEBAS,
      embeds,
      token: config.discord.token
    });
  }
  return {};
};
