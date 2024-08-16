export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { context, user } = body;
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const avatarType = getValue("tipo") || "servidor";

  interface DiscordAvatarInfo {
    id: string;
    username?: string;
    avatarGlobal?: string | null;
    avatar?: string | null;
    discriminator?: string;
    guildId?: string;
  }

  const info: { user: DiscordAvatarInfo } = {
    user: {
      id: "",
      username: "",
      avatarGlobal: "",
      avatar: "",
      discriminator: "",
      guildId: ""
    }
  };

  switch (context) {
    case 0:
      info.user = resolved && userId ? {
        id: userId,
        username: resolved.users[userId]?.username,
        avatarGlobal: resolved.users[userId]?.avatar,
        avatar: avatarType === "servidor" && resolved.members[userId]?.avatar ? resolved.members[userId]?.avatar : resolved.users[userId]?.avatar,
        discriminator: resolved.users[userId]?.discriminator,
        guildId: avatarType === "servidor" && resolved.members[userId]?.avatar ? body.guild_id : undefined
      } : {
        id: body.member.user.id,
        username: body.member.user.username,
        avatarGlobal: body.member.user.avatar,
        avatar: avatarType === "servidor" && body.member.avatar ? body.member.avatar : body.member.user.avatar,
        discriminator: body.member.user.discriminator,
        guildId: avatarType === "servidor" && body.member.avatar ? body.guild_id : undefined
      };
      break;
    case 1:
    case 2:
      info.user = {
        id: user.id,
        username: user.username,
        avatarGlobal: user.avatar,
        avatar: user.avatar,
        discriminator: user.discriminator
      };
      break;
  }

  const button = [{
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.LINK,
    label: "Global Avatar",
    url: getAvatarURL({
      userId: info.user.id,
      avatarHash: info.user.avatarGlobal,
      userDiscriminator: info.user.discriminator,
      imageSize: 1024
    })
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
        url: getAvatarURL({
          userId: info.user.id,
          avatarHash: info.user.avatar,
          userDiscriminator: info.user.discriminator,
          imageSize: 1024,
          guildId: info.user.guildId
        })
      }
    }]
  });
};
