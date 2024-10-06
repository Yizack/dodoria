export const handlerVideoReload: CommandHandler = (event, { body }) => {
  const { token, message } = body;
  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const oldVideoUrl = message.embeds[0].url as string;
    const oldContent = message.content;
    const { protocol, host, pathname } = parseURL(oldVideoUrl);
    const { video_url, redirect_url } = getQueryUfo(oldVideoUrl);
    const newVideoUrl = withQuery(`${protocol}//${host}${pathname}`, { video_url, redirect_url, t: Date.now() });
    const newContent = oldContent.replace(oldVideoUrl, newVideoUrl);
    return editFollowUpMessage(newContent, {
      token,
      application_id: config.discord.applicationId,
      message_id: message.id
    });
  };

  event.context.cloudflare.context.waitUntil(followUpRequest());
  return updateMessage();
};
