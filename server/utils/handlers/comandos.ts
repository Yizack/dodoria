import { ApplicationCommandOptionType, MessageFlags } from "discord-api-types/v10";

export default defineCommandHandler(COMANDOS.name, () => {
  const list: string[] = [];

  for (const command of Object.values(COMMANDS)) {
    if (command.options?.every(({ type }) => type === ApplicationCommandOptionType.Subcommand)) {
      for (const [name] of Object.entries(command.options ?? [])) {
        list.push(`-  </${command.name} ${name}:${command.cid}> *${command.description}*\n`);
      }
      continue;
    }

    list.push(`-  </${command.name}:${command.cid}> *${command.description}*\n`);
  }

  return reply(null, {
    flags: MessageFlags.Ephemeral,
    embeds: [{
      title: "Lista de comandos",
      description: "Conoce la lista de comandos disponibles.\n\n"
        + `${list.join("")}`
        + "Escribe el comando que desees en la caja de enviar mensajes de discord y selecciona la opción que se muestra junto al avatar del bot. Se irán añadiendo más comandos divertidos con el tiempo.",
      color: CONSTANTS.COLOR,
      author: {
        name: CONSTANTS.BOT,
        icon_url: `${SITE.url}/${CONSTANTS.AVATAR}`
      },
      image: {
        url: CONSTANTS.GUIDE
      },
      footer: {
        text: `Creado por ${CONSTANTS.OWNER}.`
      }
    }]
  });
});
