export const handlerCopys: CommandHandler = (event, { body, getValue }) => {
  const { token } = body;
  const config = useRuntimeConfig(event);
  const audioId = getValue("nombre");

  const followUpRequest = async () => {
    const blob = await useStorage().getItemRaw<Blob>(`root/public/copys/${audioId}.ogg`);
    console.info(blob);
    console.info(audioId);
    const files = [{ name: `${audioId}.ogg`, file: blob }];
    return deferUpdate("test", {
      token,
      application_id: config.discord.applicationId,
      files
    });
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
