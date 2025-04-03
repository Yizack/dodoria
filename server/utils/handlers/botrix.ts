export const handlerBotrix: CommandHandler = async (event, { body }) => {
  const { token, data } = body;
  const subCommand = data.options?.[0].name;
  const config = useRuntimeConfig(event);
  const embeds: DiscordEmbed[] = [];

  if (!subCommand || !BOTRIX.options?.map(o => o.name).includes(subCommand)) {
    return deferUpdate({
      token,
      application_id: config.discord.applicationId,
      embeds: errorEmbed("⚠️ Error. El subcomando no es válido.")
    });
  }

  const followUpRequest = async () => {
    if (subCommand === "leaderboard") {
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

      embeds.push({
        color: CONSTANTS.COLOR,
        fields: [{
          name: "Leaderboard de Botrix en el canal de Kick de ANGAR",
          value: values.join("\n")
        }]
      /*
      footer: {
        text: `Página ${currentPage} de ${pagesAvailable}`
      }
      */
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
