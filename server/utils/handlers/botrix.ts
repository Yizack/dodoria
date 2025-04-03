export const handlerBotrix: CommandHandler = async (event, { body }) => {
  const { token, data } = body;
  const subCommand = data.options?.[0]?.name;
  const config = useRuntimeConfig(event);
  const embeds: DiscordEmbed[] = [];

  if (!subCommand || !BOTRIX.options?.map(o => o.name).includes(subCommand)) {
    return reply(null, {
      embeds: errorEmbed("⚠️ Error. Comando no válido.")
    });
  }

  const followUpRequest = async () => {
    if (subCommand === "leaderboard") {
      const leaderboard = await $fetch("/api/botrix/leaderboard").catch(() => []);

      if (!leaderboard.length) {
        return deferUpdate({
          token,
          application_id: config.discord.applicationId,
          embeds: errorEmbed("⚠️ Error. No se pudo obtener el leaderboard de Botrix.")
        });
      }

      const pageSize = 10;
      const pageCount = Math.ceil(leaderboard.length / pageSize);
      const currentPage = 1;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const items = leaderboard.slice(start, end);

      const values: string[] = items.map((user, i) => {
        const emoji = i < 3 ? ["🥇", "🥈", "🥉"][i] : "🎖️";
        return `${emoji} **${user.name}**・${user.points.toLocaleString()} puntos`;
      });

      embeds.push({
        color: CONSTANTS.COLOR,
        author: {
          name: CONSTANTS.BOT,
          url: SITE.url,
          icon_url: `${SITE.url}/${CONSTANTS.AVATAR}`
        },
        thumbnail: {
          url: "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/aa9c649812ffbd3af3349bd86be145dc15994316.png"
        },
        fields: [{
          name: "Leaderboard de Botrix en el canal de Kick de ANGAR",
          value: values.join("\n")
        }],
        footer: {
          text: `Página ${currentPage} de ${pageCount}`,
          timestamp: new Date().toISOString()
        }
      });

      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds
      });
    }
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
