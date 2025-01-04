import { ComponentType } from "discord-api-types/v10";

export const handlerBaneadosPagination: ComponentHandler = (event, { body }) => {
  const config = useRuntimeConfig(event);
  const { token, data: { custom_id }, message } = body;
  const followUpRequest = async () => {
    const pages = message.embeds[0]!.footer!.text!.match(/\d+/g);
    const [current, available] = pages as string[];
    const cacheKey = `fn:baneados:${message.interaction!.id}.json`;
    const baneados = await useStorage("cache").getItem<{ value: BaneadoEntry[] }>(cacheKey);
    const buttons = message.components[0]!.components;
    if (!baneados) {
      for (const b of buttons) b.disabled = true;
      const components = [{
        type: ComponentType.ActionRow,
        components: buttons
      }];
      return editFollowUpMessage("", {
        token,
        application_id: config.discord.applicationId,
        message_id: message.id,
        components
      });
    }

    const newCurrent = custom_id === "btn_baneados_prev" ? Number(current!) - 1 : Number(current!) + 1;
    for (const b of buttons) {
      if (custom_id === "btn_baneados_prev" && "btn_baneados_prev" === b.custom_id && (newCurrent <= 1)) b.disabled = true;
      else if (custom_id === "btn_baneados_next" && "btn_baneados_next" === b.custom_id && (newCurrent >= Number(available))) b.disabled = true;
      else b.disabled = false;
    }
    const components = [{
      type: ComponentType.ActionRow,
      components: buttons
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
