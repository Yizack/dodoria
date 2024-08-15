export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const member = resolved.users[userId] || body.member;
  console.log(member);
  const avatarType = getValue("tipo") || "global";
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
      title: member.username + Number(member.discriminator) ? `#${member.discriminator}` : "",
      color: CONSTANTS.COLOR,
      image: {
        url: getAvatarURL(userId, avatar, member.discriminator, 1024)
      }
    }]
  });
};
