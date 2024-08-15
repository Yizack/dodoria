export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const avatarType = getValue("tipo") || "servidor";

  const user = resolved && userId ? {
    id: userId,
    username: resolved.users[userId]?.username,
    avatarGlobal: resolved.users[userId]?.avatar,
    avatar: avatarType === "servidor" && resolved.members[userId]?.avatar ? resolved.members[userId]?.avatar : resolved.users[userId]?.avatar,
    discriminator: resolved.users[userId]?.discriminator
  } : {
    id: body.member.user.id,
    username: body.member.user.username,
    avatarGlobal: body.member.user.avatar,
    avatar: avatarType === "servidor" && body.member.avatar ? body.member.avatar : body.member.user.avatar,
    discriminator: body.member.user.discriminator
  };
  console.info(resolved ? resolved : body);
  const button = [{
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.LINK,
    label: "Global Avatar",
    url: getAvatarURL(user.id, user.avatarGlobal, user.discriminator, 1024)
  }];

  const components = [{
    type: MessageComponentTypes.ACTION_ROW,
    components: button
  }];

  return reply(null, {
    components,
    embeds: [{
      title: user.username + (Number(user.discriminator) ? `#${user.discriminator}` : ""),
      color: CONSTANTS.COLOR,
      image: {
        url: getAvatarURL(user.id, user.avatar, user.discriminator, 1024)
      }
    }]
  });
};
