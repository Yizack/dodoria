export const scrapeVideo = async (url: string, social?: string) => {
  if (!social)
    social = Object.values(VIDEO_SOCIALS).find(({ domains }) => domains.some(domain => url.includes(domain)))?.name;
  const encodedUrl = encodeURIComponent(url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`);
  const scraperUrl = `https://dev.ahmedrangel.com/dc/${social?.toLowerCase()}-video-scrapper`;
  const req = await $fetch<VideoScrapping>(scraperUrl, {
    query: { url: encodedUrl, filter: "video" },
    retry: 3,
    retryDelay: 1000
  }).catch(() => null);

  if (!req) return null;

  req.caption = imbedUrlsFromString(`${req?.caption ? req?.caption?.replace(/(#\S+|\S+#)/g, "").replace(/([.•_\- ]+)\n/g, "").replace(/\n+/g, "\n").trim() : ""}`);
  return { ...req, social };
};

export const uploadToCdn = async (cdnToken: string, opts: { source: string, prefix: string, file_name: string, contentType: string }) => {
  const { source, prefix, file_name, contentType } = opts;
  return await $fetch<{ url: string }>("https://dev.ahmedrangel.com/cdn", {
    method: "PUT",
    headers: { "x-cdn-auth": cdnToken },
    body: {
      source,
      prefix,
      file_name,
      httpMetadata: {
        "Content-Type": contentType.includes("image/gif") ? contentType : "video/mp4",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=432000"
      }
    }
  }).catch(() => null);
};
