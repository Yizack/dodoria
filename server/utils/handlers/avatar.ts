import { ButtonStyle, ComponentType } from "discord-api-types/v10";

export default defineCommandHandler(AVATAR.name, (event, { body, getValue }) => {
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

  const isResolved = resolved && userId;
  if (context === 0) {
    if (isResolved) userInfo = getUserInfo(resolved.users[userId]!, resolved.members[userId]!);
    else userInfo = getUserInfo(member.user, member);
  }
  else if (context === 1 || context === 2) {
    if (isResolved) userInfo = getUserInfo(resolved.users[userId]!, null);
    else userInfo = getUserInfo(user, null);
  }
  else {
    return reply("Esta función no está disponible en este contexto.");
  }

  let components: DiscordComponent[] | undefined;

  if (context === 0) {
    const button = [{
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: "Global Avatar",
      url: getAvatarURL({
        userId: userInfo.id,
        avatarHash: userInfo.avatarGlobal,
        userDiscriminator: userInfo.discriminator,
        imageSize: 1024
      })
    }];

    components = [{
      type: ComponentType.ActionRow,
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
});
