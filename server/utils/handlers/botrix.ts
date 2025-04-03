export const handlerBotrix: CommandHandler = async (event, { body }) => {
  const { token, data } = body;
  const subCommand = data.options?.[0].name;
  const config = useRuntimeConfig(event);
  const embeds: DiscordEmbed[] = [];

  if (!subCommand || !BOTRIX.options?.map(o => o.name).includes(subCommand)) {
    return reply(null, {
      embeds: errorEmbed("⚠️ Error. Comando no válido.")
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

      const pageSize = 5;
      const currentPage = 1;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const items = leaderboard.slice(start, end);

      const values: string[] = items.map((user, i) => {
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
