export const handlerVideoReload: ComponentHandler = (event, { body }) => {
  const { token, message } = body;
  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const now = Date.now();
    const oldContent = message.content;
    const oldVideoUrl = message.embeds[0]?.url || oldContent.match(/\((https?:\/\/[^\s]+?)\)/)?.[1] as string;
    const { protocol, host, pathname } = parseURL(oldVideoUrl);
    const { video_url, redirect_url } = getQueryUfo(oldVideoUrl);
    const newVideoUrl = withQuery(`${protocol}//${host}${pathname}`, { video_url, redirect_url, t: now });
    const isAvailable = await $fetch(String(video_url), { query: { t: now } }).catch(() => null);

    if (!isAvailable) {
      const scraper = await scrapeVideo(String(redirect_url));
      if (scraper) {
        const { id, social, format, short_url, caption } = scraper;
        const videoChecker = await $fetch.raw(scraper.video_url).catch(() => null);
        const contentType = videoChecker?.headers.get("content-type");
        const uploaded = await uploadToCdn(config.cdnToken, {
          source: scraper.video_url,
          prefix: `videos/${social?.toLowerCase()}`,
          file_name: `${id}.${format || "mp4"}`,
          contentType: contentType?.includes("image/gif") ? contentType : "video/mp4"
        });
        const is_gif = uploaded?.url.includes(".gif");
        const emoji = getSocial(social!);
        const fxUrl = is_gif ? withQuery(uploaded!.url, { t: now }) : withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: uploaded!.url, redirect_url: short_url, t: now });
        const fixedCaption = caption.length > 450 ? caption.substring(0, 450) + "..." : caption;
        const mensaje = `[${emoji}](${fxUrl}) **${social}**: [${short_url.replace("https://", "")}](<${short_url}>)\n${fixedCaption}`;
        return editFollowUpMessage(mensaje, {
          token,
          application_id: config.discord.applicationId,
          message_id: message.id
        });
      }
    }

    const newContent = oldContent.replace(oldVideoUrl, newVideoUrl);
    return editFollowUpMessage(newContent, {
      token,
      application_id: config.discord.applicationId,
      message_id: message.id
    });
  };

  event.waitUntil(followUpRequest());
  return updateMessage();
};
