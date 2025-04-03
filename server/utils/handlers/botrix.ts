export const handlerBotrix: CommandHandler = async (event, { body }) => {
  const { token } = body;
  const config = useRuntimeConfig(event);
  const leaderboard = await $fetch("/api/botrix").catch(() => []);

  if (!leaderboard.length) {
    return deferUpdate({
      token,
      application_id: config.discord.applicationId,
      embeds: errorEmbed("⚠️ Error. No se pudo obtener el leaderboard de Botrix.")
    });
  }

  const values: string[] = leaderboard.map((user, i) => {
    const emoji = i < 3 ? ["🥇", "🥈", "🥉"][i] : "🎖️";
    return `${emoji} **${user.name}**・${user.points} puntos`;
  });

  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [];
    embeds.push({
      color: CONSTANTS.COLOR,
      fields: [{
        name: "Leaderboard de Botrix en el canal de Kick de ANGAR",
        value: values.join("\n")
      }],
      footer: {
        // text: `Página ${currentPage} de ${pagesAvailable}`
      }
    });

    return deferUpdate({
      token,
      application_id: config.discord.applicationId,
      embeds
    });
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
