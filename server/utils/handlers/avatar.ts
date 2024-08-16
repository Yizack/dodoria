export const handlerAvatar: CommandHandler = (event, { body, getValue }) => {
  const { context, user, member } = body;
  const { resolved } = body.data;
  const userId = getValue("usuario");
  const avatarType = getValue("tipo") || "servidor";

  const getUserInfo = (sourceUser: DiscordUser, sourceMember: Omit<DiscordMember, "user"> | null) => ({
    id: sourceUser.id,
    username: sourceUser.username,
    avatarGlobal: sourceUser.avatar,
    avatar: avatarType === "servidor" && sourceMember?.avatar ? sourceMember.avatar : sourceUser.avatar,
    discriminator: sourceUser.discriminator,
    guildId: avatarType === "servidor" && sourceMember?.avatar ? body.guild_id : undefined
  });

  let userInfo: ReturnType<typeof getUserInfo>;

  if (resolved && userId) userInfo = getUserInfo(resolved.users[userId]!, resolved.members[userId]!);
  else if (context === 0) userInfo = getUserInfo(member.user, member);
  else userInfo = getUserInfo(user, null);

  let components: DiscordComponent[] | undefined;

  if (context === 0) {
    const button = [{
      type: MessageComponentTypes.BUTTON,
      style: ButtonStyleTypes.LINK,
      label: "Global Avatar",
      url: getAvatarURL({
        userId: userInfo.id,
        avatarHash: userInfo.avatarGlobal,
        userDiscriminator: userInfo.discriminator,
        imageSize: 1024
      })
    }];

    components = [{
      type: MessageComponentTypes.ACTION_ROW,
      components: button
    }];
  }

  return reply(null, {
    components,
    embeds: [{
      title: userInfo.username + (Number(userInfo.discriminator) ? `#${userInfo.discriminator}` : ""),
      color: CONSTANTS.COLOR,
      image: {
        url: getAvatarURL({
          userId: userInfo.id,
          avatarHash: userInfo.avatar,
          userDiscriminator: userInfo.discriminator,
          imageSize: 1024,
          guildId: userInfo.guildId
        })
      }
    }]
  });
};
