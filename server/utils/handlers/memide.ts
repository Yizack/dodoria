export const handlerMeMide: CommandHandler = (event, { body }) => {
  const { member } = body;
  const cm = getRandom({ max: 32 });
  const emoji = cm >= 15 ? getEmoji("angarMonkas") : getEmoji("angarSad");
  return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
};
