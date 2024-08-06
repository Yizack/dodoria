export const handlerAngar = (event: H3Event, body: WebhookBody) => {
  const { member } = body;

  const button = [{
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.LINK,
    label: "Ver galería",
    url: "https://dodoria.yizack.com/c/angar"
  }];

  const components = [{
    type: MessageComponentTypes.ACTION_ROW,
    components: button
  }];

  return reply(null, {
    components,
    embeds: [{
      title: getRandomAngarMessage(),
      description: "",
      color: CONSTANTS.COLOR,
      author: {
        name: `${member.user.username}`,
        icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
      },
      image: {
        url: getRandomAngar()
      }
    }]
  });
};
