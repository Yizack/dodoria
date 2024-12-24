import { AuditLogEvent } from "discord-api-types/v10";

export const handlerBaneados: CommandHandler = (event, { body }) => {
  const { token, guild_id } = body;
  const config = useRuntimeConfig(event);
  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [];
    const banLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberBanAdd,
      limit: 20
    }).catch(() => null);
    const unbanLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberBanAdd,
      limit: 20
    }).catch(() => null);
    const updatedLogs = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      action_type: AuditLogEvent.MemberBanAdd,
      limit: 20
    }).catch(() => null);

    if (!banLogs && !unbanLogs && !updatedLogs) {
      return deferUpdate("", {
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
            timeoutUntil: timeout.new_value || timeout.old_value
          };
        }
      }
      return useInfo;
    }).sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

    const bansAndTimeoutsValues = filteredEntries.map((el) => {
      const date = el.timeoutUntil ? Math.floor(new Date(el.timeoutUntil).getTime() / 1000) : null;
      const now = Math.floor(Date.now() / 1000);
      const timeout = date ? `<t:${date}:d>, <t:${date}:t>` : "N/A";
      const action = el.action === AuditLogEvent.MemberBanAdd ? "baneado" : el.action === AuditLogEvent.MemberBanRemove ? "desbaneado" : "timeout";
      const timeoutEmoji = now > date! ? "🟩" : "🟨";
      const banUnbanEmoji = action === "baneado" ? "🟥" : "🟩";
      const messageValue = action === "timeout" ? `${timeoutEmoji} **${el.username}**・${action} hasta: ${timeout}` : `${banUnbanEmoji} **${el.username}**・${action}`;
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
