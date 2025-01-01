export const handlerCopys: CommandHandler = (event, { body, getValue }) => {
  const { token } = body;
  const config = useRuntimeConfig(event);
  const audioId = getValue("nombre");

  const followUpRequest = async () => {
    const buffer = await useStorage().getItemRaw<Buffer>(`root/public/copys/${audioId}.ogg`);
    // TODO: handle when not found
    const blob = new Blob([buffer!], { type: "audio/ogg" });
    console.info(blob);
    console.info(blob.type, blob.size);
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
