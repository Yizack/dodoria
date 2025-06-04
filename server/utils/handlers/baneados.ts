import { AuditLogEvent, ButtonStyle, ComponentType } from "discord-api-types/v10";
import { upperFirst } from "scule";

export default defineCommandHandler(BANEADOS.name, (event, { body, getValue }) => {
  const { token, id } = body;
  const config = useRuntimeConfig(event);
  const plataforma = getValue<"discord" | "kick">("plataforma") || "discord";

  let guild_id = body.guild_id;
  if (guild_id === "1379436393117388932") { // not DODORITOS Guild ID
    guild_id = "607559322175668248"; // ANGAR Guild ID
  }

  const getDiscordEntries = async () => {
    const banLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberBanAdd,
      limit: 100
    }).catch(() => null);
    const unbanLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberBanRemove,
      limit: 100
    }).catch(() => null);
    const updatedLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberUpdate,
      limit: 100
    }).catch(() => null);

    if (!banLogs && !unbanLogs && !updatedLogs) {
      throw new Error("Error. El bot no cuenta con los permisos para utilizar este comando.");
    }

    const users = [...new Set([...banLogs!.users, ...unbanLogs!.users, ...updatedLogs!.users].map(user => ({ id: user.id, username: user.username })))];
    const entries = [...banLogs!.audit_log_entries, ...unbanLogs!.audit_log_entries, ...updatedLogs!.audit_log_entries];
    if (!entries.length) {
      throw new Error("No hay logs para mostrar.");
    }

    return entries.filter(el => (el.action_type === AuditLogEvent.MemberUpdate && el.changes?.some(el => el.key === "communication_disabled_until")) || el.action_type !== AuditLogEvent.MemberUpdate).map((el) => {
      const useInfo = {
        id: el.target_id,
        username: users.find(user => user.id === el.target_id)!.username,
        action: el.action_type,
        timestamp: Number((BigInt(el.id) >> BigInt("22")) + BigInt("1420070400000")),
        timeoutUntil: undefined
      };
      if (el.changes) {
        const timeout = el.changes.find(change => change.key === "communication_disabled_until");
        if (timeout) {
          return {
            ...useInfo,
            timeoutUntil: timeout?.new_value
          };
        }
      }
      return useInfo;
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  const getKickEntries = async () => {
    const DB = useDB();
    const entries = await DB.select().from(tables.kickBans).orderBy(desc(tables.kickBans.createdAt)).limit(100).all();

    if (!entries.length) {
      throw new Error("No hay logs para mostrar.");
    }

    return entries.map(entry => ({
      id: entry.id,
      username: entry.username,
      action: entry.type,
      timestamp: entry.createdAt,
      timeoutUntil: entry.expiresAt
    }));
  };

  const followUpRequest = async () => {
    try {
      const entries = await (plataforma === "kick" ? getKickEntries() : getDiscordEntries()); // can throw errors
      const pagesAvailable = Math.ceil(entries.length / 16);
      const currentPage = 1;
      const baneadosData = { id, data: { plataforma, values: entries } };
      const pagedData = await createCachedData(event, "baneados", baneadosData);
      const pagedEntries = pagedData.values.slice((currentPage - 1) * 16, currentPage * 16);

      const values = getBansEmbedValues(pagedEntries, plataforma);
      const embeds: DiscordEmbed[] = [];
      embeds.push({
        color: CONSTANTS.COLOR,
        title: `${socials[plataforma]} Historial de bans, timeouts y unbans recientes en ${upperFirst(plataforma)}`,
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
        custom_id: "baneados:btn-prev",
        emoji: {
          name: "arrowLeft",
          id: "1324906526430986291"
        },
        disabled: true
      }, {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "baneados:btn-next",
        emoji: {
          name: "arrowRight",
          id: "1324906542105100390"
        },
        ...currentPage === pagesAvailable && { disabled: true }
      });

      const stringSelect: DiscordStringSelect = {
        type: ComponentType.StringSelect,
        custom_id: "baneados:select-page",
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
