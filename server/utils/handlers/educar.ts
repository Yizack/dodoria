export const handlerEducar = async (event: H3Event, body: WebhookBody) => {
  const { member, guild_id } = body;
  const { options } = body.data;

  const usuario = getValue("usuario", options);

  let message = `<@${member.user.id}> no ha podido educar a <@${usuario}>`;
  const embeds = [];

  const percent = getRandom({ max: 100 });
  if (percent < 33) {
    const key = guild_id + "-" + usuario;
    let counter = Number(await event.context.cloudflare.env.EDUCAR.get(key));
    counter = counter ? counter + 1 : 1;
    await event.context.cloudflare.env.EDUCAR.put(key, counter.toString());

    const veces = counter === 1 ? "vez" : "veces";

    message = `<@${usuario}> te educaron.`;
    embeds.push({
      description: `**${member.user.username}** ha educado a **<@${usuario}>**.\n*<@${usuario}> ha sido educado **${counter}** ${veces} en total.*`,
      color: CONSTANTS.COLOR
    });
  }
  return reply(message, { embeds: embeds });
};
