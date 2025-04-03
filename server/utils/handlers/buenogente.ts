export default defineCommandHandler(BUENOGENTE.name, () => {
  return reply(null, {
    embeds: [{
      title: "🖐 ANGAR se ha despedido con un \"BUENO GENTE\"",
      description: "¡Bueno gente! 🖐🖐👊",
      color: CONSTANTS.COLOR,
      author: {
        name: CONSTANTS.BOT,
        icon_url: `${SITE.url}/${CONSTANTS.AVATAR}`
      },
      image: {
        url: getRandomBuenoGente()
      }
    }]
  });
});
