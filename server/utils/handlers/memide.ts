export const handlerMeMide = (event: H3Event, body: WebhookBody) => {
  const { member } = body;
  const cm = getRandom({ max: 32 });
  const emoji = cm >= 15 ? getEmoji("angarMonkas") : getEmoji("angarSad");
  return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
};
