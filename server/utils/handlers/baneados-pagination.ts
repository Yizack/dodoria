import { ComponentType } from "discord-api-types/v10";

export const handlerBaneadosPagination: ComponentHandler = (event, { body }) => {
  const config = useRuntimeConfig(event);
  const { token, data, message } = body;
  console.info(data);
  const followUpRequest = async () => {
    const pages = message.embeds[0]!.footer!.text!.match(/\d+/g);
    const [current, available] = pages as string[];
    const cacheKey = `fn:baneados:${message.interaction!.id}.json`;
    const baneados = await useStorage("cache").getItem<{ value: BaneadoEntry[] }>(cacheKey);
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

    const newCurrent = data!.custom_id === "select_baneados_page" ? Number(data!.values?.[0]) : data!.custom_id === "btn_baneados_prev" ? Number(current!) - 1 : Number(current!) + 1;
    for (const b of buttons) {
      if ((data!.custom_id === "btn_baneados_prev" || data!.custom_id === "select_baneados_page") && "btn_baneados_prev" === b.custom_id && (newCurrent <= 1)) b.disabled = true;
      else if ((data!.custom_id === "btn_baneados_next" || data!.custom_id === "select_baneados_page") && "btn_baneados_next" === b.custom_id && (newCurrent >= Number(available))) b.disabled = true;
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
    const pagedData = baneados.value.slice((fixedPage - 1) * 16, fixedPage * 16);
    const updatedEmbeds = buildBaneadosEmbed(pagedData, Number(available), fixedPage);
    return editFollowUpMessage("", {
      token,
      application_id: config.discord.applicationId,
      message_id: message.id,
      embeds: updatedEmbeds,
      components
    });
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return updateMessage();
};
