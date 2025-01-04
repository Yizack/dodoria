import { ComponentType } from "discord-api-types/v10";

export const handlerBaneadosPagination: ComponentHandler = (event, { body }) => {
  const config = useRuntimeConfig(event);
  const { token, data: { custom_id }, message } = body;
  const followUpRequest = async () => {
    const pages = message.embeds[0]!.footer!.text!.match(/\d+/g);
    const [current, available] = pages as string[];
    const baneados = await useStorage()?.getItem<BaneadoEntry[]>(`fn:baneados:${message.interaction!.id}.json`);
    console.info(baneados);
    const buttons = message.components[0].components;
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

    const newCurrent = custom_id === "btn_baneados_prev" ? Number(current) - 1 : Number(current + 1);
    for (const b of buttons) {
      if ("btn_baneados_prev" === b.custom_id && (newCurrent <= 1)) b.disabled = true;
      if ("btn_baneados_next" === b.custom_id && (newCurrent >= Number(available))) b.disabled = true;
    }
    const components = [{
      type: ComponentType.ActionRow,
      components: buttons
    }];

    const updatedEmbeds = buildBaneadosEmbed(baneados, Number(available), newCurrent);
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
