import { ComponentType } from "discord-api-types/v10";
import { upperFirst } from "scule";

export const handlerBaneadosRankingPagination: ComponentHandler = (event, { body }) => {
  const config = useRuntimeConfig(event);
  const { token, data, message } = body;
  const followUpRequest = async () => {
    const pages = message.embeds[0]!.footer!.text!.match(/\d+/g);
    const [current, available] = pages as string[];
    const cacheKey = `fn:baneados-ranking:${message.interaction!.id}.json`;
    const baneados = await useStorage("cache").getItem<{ value: { plataforma: "discord" | "kick"; values: {
      username: string;
      bans: number;
      timeouts: number;
    }[]; }; }>(cacheKey);
    const buttons = message.components[0]!.components as DiscordButton[];
    const stringSelect = message.components[1]!.components as DiscordStringSelect[];

    if (!baneados) {
      for (const b of buttons) b.disabled = true;
      for (const s of stringSelect) s.disabled = true;
      const components = [{
        type: ComponentType.ActionRow,
        components: buttons
      }, {
        type: ComponentType.ActionRow,
        components: stringSelect
      }];
      return editFollowUpMessage("", {
        token,
        application_id: config.discord.applicationId,
        message_id: message.id,
        components
      });
    }

    const newCurrent = data!.custom_id === "baneados-ranking:select-page" ? Number(data!.values?.[0]) : data!.custom_id === "baneados-ranking:btn-prev" ? Number(current!) - 1 : Number(current!) + 1;
    for (const b of buttons) {
      if ((data!.custom_id === "baneados-ranking:btn-prev" || data!.custom_id === "baneados-ranking:select-page") && "baneados-ranking:btn-prev" === b.custom_id && (newCurrent <= 1)) b.disabled = true;
      else if ((data!.custom_id === "baneados-ranking:btn-next" || data!.custom_id === "baneados-ranking:select-page") && "baneados-ranking:btn-next" === b.custom_id && (newCurrent >= Number(available))) b.disabled = true;
      else b.disabled = false;
    }

    stringSelect[0]!.placeholder = `Página ${newCurrent}`;
    stringSelect[0]!.options = Array.from({ length: Number(available) }, (_, i) => ({
      label: `Página ${i + 1}`,
      value: `${i + 1}`
    }));

    const components = [{
      type: ComponentType.ActionRow,
      components: buttons
    }, {
      type: ComponentType.ActionRow,
      components: stringSelect
    }];

    const fixedPage = Math.max(1, Math.min(Number(available), newCurrent));
    const { values: entries, plataforma } = baneados.value;
    const pagedData = entries.slice((fixedPage - 1) * 16, fixedPage * 16);
    const values = pagedData.map((entry, index) => {
      const emoji = fixedPage === 1 && index < 3 ? ["🥇", "🥈", "🥉"][index] : "🎖️";
      const bans = entry.bans;
      const timeouts = entry.timeouts;
      const total = bans + timeouts;
      const globalIndex = (fixedPage - 1) * 16 + index + 1;
      return `${globalIndex}. ${emoji} **${entry.username}**・${bans} bans・${timeouts} timeouts・Total: ${total}`;
    });

    const embeds: DiscordEmbed[] = [];
    embeds.push({
      color: CONSTANTS.COLOR,
      title: `${socials[plataforma]} Ranking de basados en ${upperFirst(plataforma)} (a partir del 14 de mayo de 2025)`,
      description: values.join("\n"),
      timestamp: new Date().toISOString(),
      footer: {
        text: `Página ${fixedPage} de ${Number(available)}`,
        icon_url: `${SITE.host}/${CONSTANTS.AVATAR}`
      }
    });

    return editFollowUpMessage("", {
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
