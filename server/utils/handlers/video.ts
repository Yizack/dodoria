import { ButtonStyle, ComponentType } from "discord-api-types/v10";

export default defineCommandHandler(VIDEO.name, async (event, { body, getValue }) => {
  const { token, fromQueue } = body;

  const config = useRuntimeConfig(event);

  const followUpRequest = async () => {
    const embeds: DiscordEmbed[] = [], button: DiscordButton[] = [], components: DiscordComponent[] = [];
    const url = getValue("link")!;
    const social = Object.values(VIDEO_SOCIALS).find(({ domains }) => domains.some(domain => url.includes(domain)));

    if (!esUrl(url) || !social?.supported) {
      const supportedSitesEmoji = Object.values(VIDEO_SOCIALS).filter(site => site.supported).map(site => getSocial(site.name)).join(" ");
      const error = `⚠️ Error. Sitio o enlace no soportado.\nSitios soportados: ${supportedSitesEmoji}`;
      return deferUpdate({
        token,
        application_id: config.discord.applicationId,
        embeds: errorEmbed(error),
        fromQueue
      });
    }

    const scraper = await scrapeVideo(url, social.name);

    const deferUpdateError = (message?: string) => deferUpdate({
      token,
      application_id: config.discord.applicationId,
      embeds: errorEmbed(message || ":x: Error. Ha ocurrido un error obteniendo el video."),
      fromQueue
    });

    if (!scraper) {
      return deferUpdateError();
    }

    const { id, video_url, short_url, status, format, caption, is_photo } = scraper;

    if (is_photo) {
      return deferUpdateError("⚠️ Error. Este enlace no es un video.");
    }

    if (status !== 200 && !esUrl(video_url)) {
      return deferUpdateError();
    }

    const finalReply = (downloadUrl: string) => {
      const is_gif = downloadUrl.includes(".gif");
      button.push(
        {
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          label: is_gif ? "GIF" : "MP4",
          url: downloadUrl
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: "videos:btn-reload",
          emoji: {
            name: "reload",
            id: "1292318494943215616"
          }
        }
      );

      components.push ({
        type: ComponentType.ActionRow,
        components: button
      });

      const fxUrl = is_gif ? withQuery(downloadUrl, { t: Date.now() }) : withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: downloadUrl, redirect_url: short_url, t: Date.now() });
      const fixedCaption = caption.length > 450 ? caption.substring(0, 450) + "..." : caption;
      const mensaje = `[${social.emoji}](${fxUrl}) **${social.name}**: [${short_url.replace("https://", "")}](<${short_url}>)\n${fixedCaption}`;

      return deferUpdate({
        content: mensaje,
        token,
        application_id: config.discord.applicationId,
        embeds,
        components,
        fromQueue
      });
    };

    const cdnUrl = `https://cdn.ahmedrangel.com/videos/${social.name.toLowerCase()}/${id}.${format || "mp4"}`;
    const checkCdn = await $fetch.raw(withQuery(cdnUrl, { t: Date.now() })).catch(() => null);
    if (checkCdn?.ok) {
      console.info(cdnUrl);
      console.info("Existe en CDN");
      return finalReply(cdnUrl);
    }

    const videoChecker = await $fetch.raw<Blob>(video_url, {
      responseType: "blob"
    }).catch((e) => {
      console.info(e);
      return null;
    });
    const blob = videoChecker?._data;
    const contentType = videoChecker?.headers.get("content-type") ?? (blob?.size && video_url.includes(".mp4") ? "video/mp4" : "");
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
      prefix: `videos/${social.name.toLowerCase()}`,
      file_name: `${id}.${format || "mp4"}`,
      contentType: String(contentType)
    });

    if (!uploaded) return deferUpdateError();

    return finalReply(uploaded.url);
  };

  if (!fromQueue) {
    event.waitUntil(event.context.cloudflare.env.QUEUE.send(body, { delaySeconds: 10 }));
    event.waitUntil(followUpRequest());
    return deferReply();
  }
  await followUpRequest();
});
