export default defineCommandHandler(SHIP.name, (event, { body, getValue }) => {
  const { resolved } = body.data;

  const u1 = getValue("persona1")!;
  const u2 = getValue("persona2")!;
  const p = getRandom({ min: 0, max: 100 });
  const users = resolved?.users;
  const user1 = users && users[u1];
  const user2 = users && users[u2];
  const letras_nombre1 = user1?.username.substring(0, 3);
  const letras_nombre2 = user2?.username.substring(user2.username.length - 2);
  const nombre_ship = `${letras_nombre1}${letras_nombre2}`;
  const params = {
    u: [u1, u2].map(String),
    a: [user1?.avatar, user2?.avatar],
    d: [user1?.discriminator, user2?.discriminator].map(Number),
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
});
