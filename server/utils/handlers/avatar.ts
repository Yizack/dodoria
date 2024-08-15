export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const avatarType = getValue("tipo") || "servidor";

  const member = resolved ? resolved.members[userId]! : body.member;
  const avatar = (avatarType === "servidor"  && member.avatar ? member.avatar : member.user.avatar);
  console.info(JSON.stringify(resolved, null, 2));
  const button = [{
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.LINK,
    label: "Global Avatar",
    url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=1024`
  }];

  const components = [{
    type: MessageComponentTypes.ACTION_ROW,
    components: button
  }];

  return reply(null, {
    components,
    embeds: [{
      title: member.user.username + Number(member.user.discriminator) ? `#${member.user.discriminator}` : "",
      color: CONSTANTS.COLOR,
      image: {
        url: getAvatarURL(member.user.id, avatar, member.user.discriminator, 1024)
      }
    }]
  });
};
