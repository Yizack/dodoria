export const handlerVideo = async (event: H3Event, body: WebhookBody) => {
  const { token } = body;
  const { options } = body.data;

  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [], button: DiscordButton[] = [], components: DiscordComponent[] = [];
    let emoji: string;
    let supported = false;
    let red_social = "Instagram / Facebook / TikTok / X / YouTube / Twitch / Kick";
    const url = getValue("link", options);

    for (const key in CONSTANTS.VIDEO_SOCIALS) {
      const sns = CONSTANTS.VIDEO_SOCIALS[key as keyof typeof CONSTANTS.VIDEO_SOCIALS];
      if (sns.domains.some(domains => url.includes(domains))) {
        red_social = sns.name;
        emoji = getSocial(red_social);
        supported = true;
        break;
      }
    }

    if (!esUrl(url) && !supported) {
      const error = `⚠️ Error. El texto ingresado no es un link válido de **${red_social}**`;
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error)
      });
    }

    const encodedUrl = encodeURIComponent(url);
    const scraperUrl = `https://dev.ahmedrangel.com/dc/${red_social.toLowerCase()}-video-scrapper`;
    const scraperQueries = { url: encodedUrl, filter: "video" };
    const scrapping = await $fetch<VideoScrapping>(withQuery(scraperUrl, scraperQueries), { retry: 3, retryDelay: 1000 }).catch(() => null);
    if (!scrapping) {
      const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error)
      });
    }
    const { id, video_url, short_url, status } = scrapping;
    const caption = imbedUrlsFromString(`${scrapping?.caption ? scrapping?.caption?.replace(/#[^\s#]+(\s#[^\s#]+)*$/g, "").replaceAll(".\n", "").replace(/\n+/g, "\n").trim() : ""}`);
    if (status !== 200 && !esUrl(video_url)) {
      const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error)
      });
    }

    const finalReply = (downloadUrl: string) => {
      button.push({
        type: MessageComponentTypes.BUTTON,
        style: ButtonStyleTypes.LINK,
        label: "Descargar MP4",
        url: downloadUrl
      });

      components.push ({
        type: MessageComponentTypes.ACTION_ROW,
        components: button
      });

      const mensaje = `${emoji} **${red_social}**: [${short_url.replace("https://", "")}](${withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: downloadUrl, redirect_url: short_url })})\n${caption}`;
      const fixedMsg = mensaje.length > 1000 ? mensaje.substring(0, 1000) + "..." : mensaje;

      return deferUpdate(fixedMsg, {
        token,
        application_id: config.discord.applicationId,
        embeds,
        components
      });
    };

    const cdnUrl = `https://cdn.ahmedrangel.com/videos/${red_social.toLowerCase()}/${id}.mp4`;
    const checkCdn = await $fetch.raw(cdnUrl).catch(() => null);
    if (checkCdn?.ok) {
      console.info("Existe en CDN");
      return finalReply(cdnUrl);
    }

    const videoChecker = await $fetch.raw<Blob>(video_url).catch(() => null);
    const blob = videoChecker?._data;
    const contentType = videoChecker?.headers.get("content-type");
    console.info("Tamaño: " + blob?.size, "Content-Type: " + contentType);

    const maxSize = 100000000;

    if (blob && blob?.size > maxSize) {
      const error = "⚠️ Error. El video es muy pesado o demasiado largo.";
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error)
      });
    }

    if (!blob || blob?.size < 100 || !["video/mp4", "binary/octet-stream", "application/octet-stream"].includes(String(contentType))) {
      const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
      return deferUpdate("", {
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error)
      });
    }

    const uploadedUrl = await $fetch<string>(withQuery("https://dev.ahmedrangel.com/put/video", { url: video_url, prefix: "videos", dir: red_social.toLowerCase(), file_id: id }));
    return finalReply(uploadedUrl);
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};