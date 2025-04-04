export default defineCommandHandler(CHEER.name, (event, { body, getValue }) => {
  const { member, token } = body;

  const config = useRuntimeConfig(event);

  const mensaje = getValue("mensaje")!.replace(/(<([^>]+)>)/gi, "").trim();
  const bits = [
    getEmojiURL("Cheer100"),
    getEmojiURL("Cheer1k"),
    getEmojiURL("Cheer5k"),
    getEmojiURL("Cheer10k"),
    getEmojiURL("Cheer25k"),
    getEmojiURL("Cheer50k")
  ];
  if (mensaje.length > 500) return reply(`<@${member.user.id}> El mensaje no puede tener más de 500 caracteres.`);
  const followUpRequest = async () => {
    const text = encodeURIComponent(mensaje);
    const blob = await $fetch<Blob>(`https://api.streamelements.com/kappa/v2/speech?voice=${CONSTANTS.VOZ}&text=${text}`, {
      responseType: "blob"
    });
    const files = [{ name: `${hash(text)}.mp3`, file: blob }];

    return deferUpdate({
      embeds: [{
        description: `\`${mensaje}\``,
        color: CONSTANTS.COLOR,
        author: {
          name: `${member.user.username}`,
          icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
        },
        thumbnail: {
          url: getEmojiURL("angarG2")
        },
        footer: {
          text: `Voz: ${CONSTANTS.VOZ}. Caracteres: ${mensaje.length} de 500.`,
          icon_url: bits[getRandom({ min: 0, max: bits.length - 1 })]!
        }
      }],
      token,
      application_id: config.discord.applicationId,
      files
    });
  };

  event.waitUntil(followUpRequest());
  return deferReply();
});
