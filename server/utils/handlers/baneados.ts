import { ButtonStyle, ComponentType, AuditLogEvent } from "discord-api-types/v10";

export const handlerBaneados: CommandHandler = (event, { body }) => {
  const { token, guild_id, id } = body;
  const config = useRuntimeConfig(event);
  const followUpRequest = async () => {
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
      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed("⚠️ Error. El bot probablemente no cuenta con los permisos para utilizar este comando.")
      });
    }

    const users = [...new Set([...banLogs!.users, ...unbanLogs!.users, ...updatedLogs!.users].map(user => ({ id: user.id, username: user.username })))];
    const entries = [...banLogs!.audit_log_entries, ...unbanLogs!.audit_log_entries, ...updatedLogs!.audit_log_entries];
    const filteredEntries = entries.filter(el => (el.action_type === AuditLogEvent.MemberUpdate && el.changes?.some(el => el.key === "communication_disabled_until")) || el.action_type !== AuditLogEvent.MemberUpdate).map((el) => {
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
    });

    const pagesAvailable = Math.ceil(filteredEntries.length / 16);
    const currentPage = 1;
    const pagedData = filteredEntries.slice((currentPage - 1) * 16, currentPage * 16);
    const baneadosData = { id, data: pagedData };
    const pagedEntries = await cachedBaneados(baneadosData);
    const embeds = buildBaneadosEmbed(pagedEntries, pagesAvailable, currentPage);
    const button = [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "btn_baneados_next",
        emoji: {
          name: "arrowRight",
          id: "1324906526430986291"
        }
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        custom_id: "btn_baneados_prev",
        emoji: {
          name: "arrowLeft",
          id: "1324906542105100390"
        }
      }
    ];

    const components = [{
      type: ComponentType.ActionRow,
      components: button
    }];

    return deferUpdate({
      token,
      application_id: config.discord.applicationId,
      embeds,
      components
    });
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
