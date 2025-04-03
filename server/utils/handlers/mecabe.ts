export default defineCommandHandler(MECABE.name, (event, { body }) => {
  const { member } = body;
  const cm = getRandom({ max: 43 });
  const emoji = cm >= 10 ? getEmoji("angarGasm") : getEmoji("angarL");
  return reply(`A <@${member.user.id}> le caben **${cm}** centímetros. ${emoji}`);
});
