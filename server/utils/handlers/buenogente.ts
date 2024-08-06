export const handlerBuenoGente = (_event: H3Event, _body: WebhookBody) => {
  return reply(null, { embeds: [{
    title: "🖐 ANGAR se ha despedido con un \"BUENO GENTE\"",
    description: "¡Bueno gente! 🖐🖐👊",
    color: CONSTANTS.COLOR,
    author: {
      name: CONSTANTS.BOT,
      icon_url: avatar
    },
    image: {
      url: getRandomBuenoGente()
    }
  }] });
};
