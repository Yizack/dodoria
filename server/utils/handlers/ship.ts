export const handlerShip: CommandHandler = (event, { body, getValue }) => {
  const { resolved } = body.data;

  const u1 = getValue("persona1");
  const u2 = getValue("persona2");
  const p = getRandom({ min: 0, max: 100 });
  const { users } = resolved;
  const letras_nombre1 = users[u1]!.username.substring(0, 3);
  const letras_nombre2 = users[u2]!.username.substring(users[u2]!.username.length - 2);
  const nombre_ship = `${letras_nombre1}${letras_nombre2}`;
  const params = {
    u: [u1, u2].map(String),
    a: [users[u1]!.avatar, users[u2]!.avatar],
    d: [users[u1]!.discriminator, users[u2]!.discriminator].map(Number),
    p
  };
  const code = btoa(JSON.stringify(params));
  const image = `https://dodoria.yizack.com/api/ship/${code}`;
  let emoji: string;

  switch (true) {
    case p >= 90:
      emoji = getEmoji("angarH");
      break;
    case p >= 70 && p < 90:
      emoji = getEmoji("angarShy");
      break;
    case p >= 50 && p < 70:
      emoji = getEmoji("angarJu");
      break;
    case p >= 30 && p < 50:
      emoji = getEmoji("angarG");
      break;
    case p >= 10 && p < 30:
      emoji = getEmoji("angarSadge");
      break;
    default:
      emoji = getEmoji("angarSad");
      break;
  }

  return reply(`Ship entre <@${u1}> y <@${u2}>. ${emoji}`, {
    embeds: [{
      color: CONSTANTS.COLOR,
      description: `❤️ | <@${u1}> y <@${u2}> son **${p}%** compatibles.\n❤️ | El nombre del ship es **${nombre_ship}**.`,
      image: {
        url: image
      }
    }]
  });
};
