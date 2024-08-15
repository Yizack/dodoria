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

    const encodedUrl = encodeURIComponent(url);
    const scraperUrl = `https://dev.ahmedrangel.com/dc/${red_social.toLowerCase()}-video-scrapper`;
    const scraperQueries = { url: encodedUrl, filter: "video" };
    const scrapping = await $fetch<VideoScrapping>(withQuery(scraperUrl, scraperQueries), { retry: 3, retryDelay: 1000 }).catch(() => null);

    const deferUpdateError = (message?: string) => deferUpdate("", {
      token,
      application_id: config.discord.applicationId,
      embeds: errorEmbed(message || ":x: Error. Ha ocurrido un error obteniendo el video.")
    });

    if (!scrapping) {
      return deferUpdateError();
    }

    const { id, video_url, short_url, status, format } = scrapping;
    const caption = imbedUrlsFromString(`${scrapping?.caption ? scrapping?.caption?.replace(/(#\w+|#[\u0600-\u06FF]+)/g, "").replace(/(\.\n|•\n)/g, "").replace(/\n+/g, "\n").trim() : ""}`);

    if (status !== 200 && !esUrl(video_url)) {
      return deferUpdateError();
    }

    const finalReply = (downloadUrl: string) => {
      const is_gif = downloadUrl.includes(".gif");
      button.push({
        type: MessageComponentTypes.BUTTON,
        style: ButtonStyleTypes.LINK,
        label: `Descargar ${is_gif ? "GIF" : "MP4"}`,
        url: downloadUrl
      });

      components.push ({
        type: MessageComponentTypes.ACTION_ROW,
        components: button
      });

      const fxUrl = is_gif ? withQuery(downloadUrl, { c: 1 }) : withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: downloadUrl, redirect_url: short_url });
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

    const uploadedUrl = await $fetch<{ url: string }>("https://dev.ahmedrangel.com/cdn", {
      method: "PUT",
      headers: { "x-cdn-auth": `${config.cdnToken}` },
      body: {
        source: video_url,
        prefix: `videos/${red_social.toLowerCase()}`,
        file_name: `${id}.${format || "mp4"}`,
        httpMetadata: {
          "Content-Type": String(contentType).includes("image/gif") ? contentType : "video/mp4",
          "Content-Disposition": "inline",
          "Cache-Control": "public, max-age=432000"
        }
      }
    }).catch(() => null);

    if (!uploadedUrl) return deferUpdateError();

    return finalReply(uploadedUrl.url);
  };
  event.context.cloudflare.context.waitUntil(followUpRequest());
  return deferReply();
};
