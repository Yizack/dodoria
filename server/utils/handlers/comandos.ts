export const handlerComandos: CommandHandler = (event, { body }) => {
  const list: string[] = [];
  Object.values(COMMANDS).forEach((command) => {
    list.push(`-  </${command.name}:${command.cid}> *${command.description}*\n\n`);
  });

  return reply(null, {
    embeds: [{
      title: "Lista de comandos",
      description: "Conoce la lista de comandos disponibles.\n\n"
      + `${list.join("")}`
      + "Escribe el comando que desees en la caja de enviar mensajes de discord y selecciona la opción que se muestra junto al avatar del bot. Se irán añadiendo más comandos divertidos con el tiempo.",
      color: CONSTANTS.COLOR,
      author: {
        name: CONSTANTS.BOT,
        icon_url: avatar
      },
      image: {
        url: guide
      },
      footer: {
        text: `Creado por ${CONSTANTS.OWNER}.`,
        icon_url: yizack
      }
    }]
  });
};
