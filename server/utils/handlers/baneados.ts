import { AuditLogEvent } from "discord-api-types/v10";

export const handlerBaneados: CommandHandler = (event, { body }) => {
  const { token, guild_id } = body;
  const config = useRuntimeConfig(event);
  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [];
    const auditLogResponse = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      limit: 100
    }).catch(() => null);
    if (!auditLogResponse) {
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed("⚠️ Error. El bot probablemente no cuenta con los permisos para utilizar este comando.")
      });
    }
    const { audit_log_entries, users } = auditLogResponse;
    const entries = audit_log_entries.filter(el => [AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberBanRemove, AuditLogEvent.MemberUpdate].includes(el.action_type));
    const bansAndTimeouts = entries.filter(el => (el.action_type === AuditLogEvent.MemberUpdate && el.changes?.some(el => el.key === "communication_disabled_until")) || el.action_type !== AuditLogEvent.MemberUpdate).map((el) => {
      const useInfo = {
        id: el.target_id,
        username: users.find(user => user.id === el.target_id)!.username,
        action: el.action_type,
        timeoutUntil: undefined
      };
      if (el.changes) {
        const timeout = el.changes.find(change => change.key === "communication_disabled_until");
        if (timeout) {
          return {
            ...useInfo,
            timeoutUntil: timeout.new_value || timeout.old_value
          };
        }
      }
      return useInfo;
    });

    const bansAndTimeoutsValues = bansAndTimeouts.map((el) => {
      const date = el.timeoutUntil ? Math.floor(new Date(el.timeoutUntil).getTime() / 1000) : null;
      const timeout = date ? `<t:${date}:d>, <t:${date}:t>` : "N/A";
      const action = el.action === AuditLogEvent.MemberBanAdd ? "baneado" : el.action === AuditLogEvent.MemberBanRemove ? "desbaneado" : "timeout";
      const messageValue = action === "timeout" ? `🟨 **${el.username}**・${action} hasta: ${timeout}` : `${action === "baneado" ? "🟥" : "🟩"} **${el.username}**・${action}`;
      return messageValue;
    });
    embeds.push({
      color: CONSTANTS.COLOR,
      fields: [{
        name: "Bans, timeouts y unbans recientes en discord",
        value: bansAndTimeoutsValues.join("\n")
      }]
    });
    return deferUpdate("", {
      token,
      application_id: config.discord.applicationId,
      embeds
    });
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
