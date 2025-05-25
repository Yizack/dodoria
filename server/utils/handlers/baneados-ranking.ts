import { ButtonStyle, ComponentType } from "discord-api-types/v10";
import { upperFirst } from "scule";

export default defineCommandHandler(BANEADOS_RANKING.name, (event, { body, getValue }) => {
  const { token, id } = body;
  const config = useRuntimeConfig(event);
  const plataforma = getValue<"discord" | "kick">("plataforma") || "kick";

  const getKickEntries = async () => {
    const DB = useDB();
    const entries = await DB.select({
      username: tables.kickBans.username,
      bans: sql<number>`SUM(CASE WHEN ${tables.kickBans.expiresAt} IS NULL THEN 1 ELSE 0 END)`.as("bans"),
      timeouts: sql<number>`SUM(CASE WHEN ${tables.kickBans.expiresAt} IS NOT NULL THEN 1 ELSE 0 END)`.as("timeouts")
    }).from(tables.kickBans).where(eq(tables.kickBans.type, "ban")).groupBy(tables.kickBans.username)
      .orderBy(
        sql`COUNT(*) DESC`, // Total primero
        sql`SUM(CASE WHEN ${tables.kickBans.expiresAt} IS NULL THEN 1 ELSE 0 END) DESC` // Bans como desempate
      ).limit(100).all();

    if (!entries.length) {
      throw new Error("No hay logs para mostrar.");
    }

    return entries;
  };

  const followUpRequest = async () => {
    try {
      const entries = await (plataforma === "kick" ? getKickEntries() : []); // can throw errors
      const pagesAvailable = Math.ceil(entries.length / 16);
      const currentPage = 1;
      const baneadosData = { id, data: { plataforma, values: entries } };
      const pagedData = await createCachedData(event, "baneados-ranking", baneadosData);
      const pagedEntries = pagedData.values.slice((currentPage - 1) * 16, currentPage * 16);

      const values = pagedEntries.map((entry, index) => {
        const emoji = currentPage === 1 && index <= 3 ? ["🥇", "🥈", "🥉"][index - 1] : "🎖️";
        const bans = entry.bans;
        const timeouts = entry.timeouts;
        const total = bans + timeouts;
        return `${index + 1}. ${emoji} **${entry.username}**・${bans} bans・${timeouts} timeouts・Total: ${total}`;
      });
      const embeds: DiscordEmbed[] = [];
      embeds.push({
        color: CONSTANTS.COLOR,
        title: `${socials[plataforma]} Ranking de basados en ${upperFirst(plataforma)}`,
        description: values.join("\n"),
        timestamp: new Date().toISOString(),
        footer: {
          text: `Página ${currentPage} de ${pagesAvailable}`,
          icon_url: `${SITE.host}/${CONSTANTS.AVATAR}`
        }
      });

      const buttons: DiscordButton[] = [];
      buttons.push({
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "baneados-ranking:btn-prev",
        emoji: {
          name: "arrowLeft",
          id: "1324906526430986291"
        },
        disabled: true
      }, {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "baneados-ranking:btn-next",
        emoji: {
          name: "arrowRight",
          id: "1324906542105100390"
        },
        ...currentPage === pagesAvailable && { disabled: true }
      });

      const stringSelect: DiscordStringSelect = {
        type: ComponentType.StringSelect,
        custom_id: "baneados-ranking:select-page",
        placeholder: "Selecciona una página",
        options: Array.from({ length: pagesAvailable }, (_, i) => ({
          label: `Página ${i + 1}`,
          value: `${i + 1}`
        }))
      };

      const components = [{
        type: ComponentType.ActionRow,
        components: buttons
      }, {
        type: ComponentType.ActionRow,
        components: [stringSelect]
      }];

      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds,
        components
      });
    }
    catch (error) {
      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(`⚠️ ${(error as Error).message}`)
      });
    }
  };
  event.waitUntil(followUpRequest());
  return deferReply();
});
