export const handlerLolMMR = async (event: H3Event, body: WebhookBody) => {
  const { token } = body;
  const { options } = body.data;

  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const riotId = (getValue("riot_id", options)).replace(/ /g, "").split("#");
    const region = getValue("servidor", options);
    const queue = getValue("cola", options);
    const riotName = riotId[0];
    const riotTag = riotId[1];
    if (!riotTag || !riotName) {
      return deferUpdate("", { token, application_id: config.discord.applicationId,
        embeds: [{
          color: CONSTANTS.COLOR,
          description: ":x: Ingrese correctamente el **Riot ID**. Ej: **Name#TAG**"
        }]
      });
    }
    const embeds: DiscordEmbed[] = [];
    const mensaje = "";
    const profileF = await fetch(`https://dev.ahmedrangel.com/lol/mmr/${region}/${riotName}/${riotTag}/${queue}`);
    const profile = await profileF.json();
    if (profile.status_code !== 404) {
      const queueName = profile.ranked.queueName === "Flex" ? "Flexible" : "Solo/Duo";
      const tierEmoji = getLeagueEmblem(profile?.ranked?.tier);
      const avgTierEmoji = getLeagueEmblem(profile?.avg?.tier);
      const wins = profile?.ranked.wins;
      const losses = profile?.ranked.losses;
      const winrate = Math.round((wins / (wins + losses)) * 100);
      embeds.push({
        type: "rich",
        title: profile?.region.toUpperCase(),
        color: CONSTANTS.COLOR,
        fields: [
          {
            name: `${queueName}: ${tierEmoji} ${profile?.ranked?.tier.toUpperCase()} ${profile?.ranked?.rank}`,
            value: `${profile?.ranked?.leaguePoints} LP・${wins}V - ${losses}D **(${winrate}% WR)**`,
            inline: false
          },
          {
            name: `ELO MMR aproximado: ${avgTierEmoji} ${profile?.avg?.tier.toUpperCase()} ${profile?.avg?.rank}`,
            value: "",
            inline: false
          }
        ],
        author: {
          name: `${profile?.riotName} #${profile?.riotTag}`,
          icon_url: profile?.profileIconUrl
        },
        footer: {
          icon_url: "https://cdn.ahmedrangel.com/LOL_Icon.png"
        }
      });
    }
    else {
      let errorName;
      switch (profile?.errorName) {
        case "riotId":
          errorName = "No se ha encontrado el **Riot ID**.";
          break;
        case "region":
          errorName = "La **región** ingresada es incorrecta.";
          break;
        case "ranked":
          errorName = `La cuenta es **unranked** en **${queue}**`;
          break;
      }
      embeds.push({
        color: CONSTANTS.COLOR,
        description: `:x: Error. ${errorName}`
      });
    }
    console.info(embeds);
    // Return del refer
    return deferUpdate(mensaje, {
      token,
      application_id: config.discord.applicationId,
      embeds
    });
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};