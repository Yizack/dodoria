import { AuditLogEvent } from "discord.js";

export const handlerBaneados: CommandHandler = (event, { body }) => {
  const { token, guild_id } = body;
  const config = useRuntimeConfig(event);
  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [];
    const { audit_log_entries, users } = await guildAuditLog<AuditLog>({
      guild_id,
      token: config.discord.token,
      limit: 100
    });
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
    embeds.push({
      color: CONSTANTS.COLOR,
      title: "Bans, timeouts y unbans recientes",
      fields: bansAndTimeouts.map((el) => {
        const timeout = el.timeoutUntil ? `<t:${Math.floor(new Date(el.timeoutUntil).getTime() / 1000)}:R>` : "N/A";
        const action = el.action === AuditLogEvent.MemberBanAdd ? "Baneado" : el.action === AuditLogEvent.MemberBanRemove ? "Desbaneado" : "Timeout";
        return {
          name: `${el.username} (${el.id})`,
          value: `**${action}**・${timeout}`
        };
      })
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
