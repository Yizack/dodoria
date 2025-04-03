import { ButtonStyle, ComponentType } from "discord-api-types/v10";

export const handlerBotRix: CommandHandler = async (event, { body, getValue }) => {
  const { token, data, id } = body;
  const subCommand = data.options?.[0]?.name;
  const config = useRuntimeConfig(event);

  if (!subCommand || !BOTRIX.options?.map(o => o.name).includes(subCommand)) {
    return reply(null, {
      embeds: errorEmbed("⚠️ Error. Comando no válido.")
    });
  }

  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [];

    if (subCommand === "puntos") {
      const username = getValue("usuario");

      const user = await $fetch("/api/botrix/user", {
        query: { username }
      }).catch(() => null);

      if (!user) {
        return deferUpdate({
          token,
          application_id: config.discord.applicationId,
          embeds: errorEmbed("⚠️ Error. No se pudo encontrar el usuario de KICK en BotRix.")
        });
      }

      const embeds: DiscordEmbed[] = [{
        color: CONSTANTS.COLOR,
        author: {
          name: "BotRix",
          icon_url: "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/aa9c649812ffbd3af3349bd86be145dc15994316.png"
        },
        description: `### <:kick:1267449535668555788> **${user.name}** tiene **${user.points.toLocaleString()}** puntos en BotRix.`,
        timestamp: new Date().toISOString(),
        footer: {
          text: CONSTANTS.BOT,
          icon_url: `${SITE.url}/${CONSTANTS.AVATAR}`
        }
      }];

      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds
      });
    }
    else if (subCommand === "leaderboard") {
      const leaderboard = await $fetch("/api/botrix/leaderboard").catch(() => []);

      if (!leaderboard.length) {
        return deferUpdate({
          token,
          application_id: config.discord.applicationId,
          embeds: errorEmbed("⚠️ Error. No se pudo obtener el leaderboard de BotRix.")
        });
      }

      const pageSize = 10;
      const pageCount = Math.ceil(leaderboard.length / pageSize);
      const currentPage = 1;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const leaderboardWithRank = leaderboard.map((user, i) => ({ ...user, rank: i + 1 }));
      const pageData = await createCachedData<BotRixCachedLeaderboard>("botrix-leaderboard", {
        id,
        data: {
          values: leaderboardWithRank,
          pageSize,
          timestamp: new Date().toISOString()
        }
      });
      const items = pageData.values.slice(start, end);

      const values: string[] = items.map((user) => {
        const emoji = currentPage === 1 && user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : "🎖️";
        return `${user.rank}. ${emoji} **${user.name}**・${user.points.toLocaleString()} puntos`;
      });

      embeds.push({
        color: CONSTANTS.COLOR,
        author: {
          name: "BotRix",
          icon_url: "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/aa9c649812ffbd3af3349bd86be145dc15994316.png"
        },
        fields: [{
          name: "Leaderboard de BotRix en el canal de Kick de ANGAR",
          value: values.join("\n")
        }],
        timestamp: new Date().toISOString(),
        footer: {
          text: `Página ${currentPage} de ${pageCount}`,
          icon_url: `${SITE.url}/${CONSTANTS.AVATAR}`
        }
      });

      const buttons: DiscordButton[] = [];
      buttons.push({
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "btn_botrix_leaderboard_prev",
        emoji: {
          name: "arrowLeft",
          id: "1324906526430986291"
        },
        disabled: true
      }, {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "btn_botrix_leaderboard_next",
        emoji: {
          name: "arrowRight",
          id: "1324906542105100390"
        },
        ...currentPage === pageCount && { disabled: true }
      });

      const stringSelect: DiscordStringSelect = {
        type: ComponentType.StringSelect,
        custom_id: "select_botrix_leaderboard_page",
        placeholder: "Selecciona una página",
        options: Array.from({ length: pageCount }, (_, i) => ({
          label: `Página ${i + 1}`,
          value: `${i + 1}`
        }))
      };

      const components = [
        { type: ComponentType.ActionRow, components: buttons },
        { type: ComponentType.ActionRow, components: [stringSelect] }
      ];

      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds,
        components
      });
    }
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
