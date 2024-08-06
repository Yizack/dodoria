export const handlerMeCabe = (event: H3Event, body: WebhookBody) => {
  const { member } = body;
  const cm = getRandom({ max: 43 });
  const emoji = cm >= 10 ? getEmoji("angarGasm") : getEmoji("angarL");
  return reply(`A <@${member.user.id}> le caben **${cm}** centímetros. ${emoji}`);
};
