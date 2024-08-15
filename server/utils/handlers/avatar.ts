export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const avatarType = getValue("tipo") || "global";

  const member = resolved.members ? resolved.members[userId]! : body.member;
  const avatar = avatarType === "global" ? member.user.avatar : member.avatar;

  const button = [{
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.LINK,
    label: "Global Avatar",
    url: `https://cdn.discordapp.com/avatars/${userId}/${member.user.avatar}.png?size=1024`
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
        url: getAvatarURL(userId, avatar, member.user.discriminator, 1024)
      }
    }]
  });
};
