import { ComponentType } from "discord-api-types/v10";

export const handlerBotRixLeaderboardPagination: ComponentHandler = (event, { body }) => {
  const config = useRuntimeConfig(event);
  const { token, data, message } = body;

  const followUpRequest = async () => {
    const pages = message.embeds[0]!.footer!.text!.match(/\d+/g);
    if (!pages) return;
    const [currentPage, pageCount] = pages.map(Number) as [number, number];
    const cacheKey = `fn:botrix-leaderboard:${message.interaction!.id}.json`;
    const cachedData = await useStorage("cache").getItem<{ value: BotRixCachedLeaderboard }>(cacheKey);
    const buttons = message.components[0]!.components as DiscordButton[];
    const stringSelect = message.components[1]!.components as DiscordStringSelect[];

    if (!cachedData) {
      for (const b of buttons) b.disabled = true;
      for (const s of stringSelect) s.disabled = true;
      const components = [
        { type: ComponentType.ActionRow, components: buttons },
        { type: ComponentType.ActionRow, components: stringSelect }
      ];
      return editFollowUpMessage(null, {
        token,
        application_id: config.discord.applicationId,
        message_id: message.id,
        components
      });
    }

    const newCurrent = data!.custom_id === "botrix-leaderboard:select-page" ? Number(data!.values?.[0]) : data!.custom_id === "botrix-leaderboard:btn-prev" ? currentPage - 1 : currentPage + 1;
    for (const b of buttons) {
      if ((data!.custom_id === "botrix-leaderboard:btn-prev" || data!.custom_id === "botrix-leaderboard:select-page") && "botrix-leaderboard:btn-prev" === b.custom_id && (newCurrent <= 1)) b.disabled = true;
      else if ((data!.custom_id === "botrix-leaderboard:btn-next" || data!.custom_id === "botrix-leaderboard:select-page") && "botrix-leaderboard:btn-next" === b.custom_id && (newCurrent >= pageCount)) b.disabled = true;
      else b.disabled = false;
    }

    stringSelect[0]!.placeholder = `Página ${newCurrent}`;
    stringSelect[0]!.options = Array.from({ length: pageCount }, (_, i) => ({
      label: `Página ${i + 1}`,
      value: `${i + 1}`
    }));

    const components = [
      { type: ComponentType.ActionRow, components: buttons },
      { type: ComponentType.ActionRow, components: stringSelect }
    ];

    const { values: pageData, sort, pageSize, timestamp } = cachedData.value;
    const fixedPage = Math.max(1, Math.min(pageCount, newCurrent));
    const start = (fixedPage - 1) * pageSize;
    const end = fixedPage * pageSize;
    const items = pageData.slice(start, end);

    const values: string[] = items.map((user) => {
      const emoji = fixedPage === 1 && user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : "🎖️";
      const value = sort === "watchtime" ? formatWatchtime(user.watchtime) : `${user.points.toLocaleString()} puntos`;
      return `${user.rank}. ${emoji} **${user.name}**・${value}`;
    });

    const embeds: DiscordEmbed[] = [{
      color: CONSTANTS.COLOR,
      author: {
        name: "BotRix",
        icon_url: `${SITE.host}/images/botrix.jpg`
      },
      title: sort === "watchtime" ? "Leaderboard de Watchtime" : "Leaderboard de Puntos",
      description: values.join("\n"),
      timestamp,
      footer: {
        text: `Página ${fixedPage} de ${pageCount}`,
        icon_url: `${SITE.host}/${CONSTANTS.AVATAR}`
      }
    }];

    return editFollowUpMessage(null, {
      token,
      application_id: config.discord.applicationId,
      message_id: message.id,
      embeds,
      components
    });
  };
  event.waitUntil(followUpRequest());
  return updateMessage();
};
