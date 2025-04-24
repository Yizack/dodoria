import { ButtonStyle, ComponentType } from "discord-api-types/v10";

export default defineCommandHandler(ANGAR.name, async (event, { body }) => {
  const { member } = body;

  const button = [{
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label: "Ver galería",
    url: "https://dodoria.yizack.com/c/angar"
  }];

  const components = [{
    type: ComponentType.ActionRow,
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
        icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`
      },
      image: {
        url: await getRandomAngar()
      }
    }]
  });
});
