import { MessageFlags } from "discord-api-types/v10";

export const handlerDonoclips: CommandHandler = (event, { body, getValue }) => {
  const { token } = body;
  const config = useRuntimeConfig(event);
  const audioValue = getValue("opcion");
  const [audioId, audioDuration] = audioValue.split(":");
  const filename = `${audioId}.ogg`;

  const followUpRequest = async () => {
    // TODO: handle when not found
    const blob = await hubBlob().get(`donoclips/${filename}`);
    const files = [{ name: filename, file: blob }];
    return deferUpdate({
      flags: MessageFlags.IsVoiceMessage,
      token,
      application_id: config.discord.applicationId,
      files,
      attachments: [
        {
          id: 0,
          filename: filename,
          duration_secs: audioDuration,
          waveform: "acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg=="
        }
      ]
    });
  };

  event.waitUntil(followUpRequest());
  return deferReply();
};
