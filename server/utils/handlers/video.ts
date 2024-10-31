export const handlerVideo: CommandHandler = (event, { body, getValue }) => {
  const { token } = body;

  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [], button: DiscordButton[] = [], components: DiscordComponent[] = [];
    let emoji: string;
    let supported = false;
    let red_social = "Instagram / Facebook / TikTok / X / YouTube / Twitch / Kick / Reddit";
    const url = getValue("link");

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

    const scraper = await scrapeVideo(url, red_social);

    const deferUpdateError = (message?: string) => deferUpdate("", {
      token,
      application_id: config.discord.applicationId,
      embeds: errorEmbed(message || ":x: Error. Ha ocurrido un error obteniendo el video.")
    });

    if (!scraper) {
      return deferUpdateError();
    }

    const { id, video_url, short_url, status, format, caption } = scraper;

    if (status !== 200 && !esUrl(video_url)) {
      return deferUpdateError();
    }

    const finalReply = (downloadUrl: string) => {
      const is_gif = downloadUrl.includes(".gif");
      button.push(
        {
          type: MessageComponentTypes.BUTTON,
          style: ButtonStyleTypes.LINK,
          label: is_gif ? "GIF" : "MP4",
          url: downloadUrl
        },
        {
          type: MessageComponentTypes.BUTTON,
          style: ButtonStyleTypes.PRIMARY,
          custom_id: "btn_reload",
          emoji: {
            name: "reload",
            id: "1292318494943215616"
          }
        }
      );

      components.push ({
        type: MessageComponentTypes.ACTION_ROW,
        components: button
      });

      const fxUrl = is_gif ? withQuery(downloadUrl, { t: Date.now() }) : withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: downloadUrl, redirect_url: short_url, t: Date.now() });
      const mensaje = `[${emoji}](${fxUrl}) **${red_social}**: [${short_url.replace("https://", "")}](<${short_url}>)\n${caption}`;
      const fixedMsg = mensaje.length > 500 ? mensaje.substring(0, 500) + "..." : mensaje;

      return deferUpdate(fixedMsg, {
        token,
        application_id: config.discord.applicationId,
        embeds,
        components
      });
    };

    const cdnUrl = `https://cdn.ahmedrangel.com/videos/${red_social.toLowerCase()}/${id}.${format || "mp4"}`;
    const checkCdn = await $fetch.raw(withQuery(cdnUrl, { t: Date.now() })).catch(() => null);
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
      return deferUpdateError("⚠️ Error. El video es muy pesado o demasiado largo.");
    }

    if (!blob || blob?.size < 100 || !["video/mp4", "binary/octet-stream", "application/octet-stream", "image/gif"].includes(String(contentType))) {
      return deferUpdateError();
    }

    const uploaded = await uploadToCdn(config.cdnToken, {
      source: video_url,
      prefix: `videos/${red_social.toLowerCase()}`,
      file_name: `${id}.${format || "mp4"}`,
      contentType: String(contentType)
    });

    if (!uploaded) return deferUpdateError();

    return finalReply(uploaded.url);
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
