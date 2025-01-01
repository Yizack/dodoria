export const handlerCopys: CommandHandler = (event, { body, getValue }) => {
  const { token } = body;
  const config = useRuntimeConfig(event);
  const audioId = getValue("nombre");
  const filename = `${audioId}.ogg`;

  const followUpRequest = async () => {
    // TODO: handle when not found
    const blob = await hubBlob().get(`copys/${filename}`);
    const files = [{ name: `${audioId}.ogg`, file: blob }];
    return deferUpdate("", {
      flags: 8192,
      token,
      application_id: config.discord.applicationId,
      files,
      attachments: [
        {
          id: "0",
          filename: filename,
          uploaded_filename: filename,
          duration_secs: 10
          // waveform: "<base64 encoded byte array>"
        }
      ]
    });
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
