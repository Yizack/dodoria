export default defineCachedEventHandler(async (event) => {
  const { p, u, a, d } = await getValidatedQuery(event, z.object({
    p: z.number({ coerce: true }).int().min(0).max(100),
    u: z.string(),
    a: z.string(),
    d: z.string()
  }).parse);

  const image = await getImage({ // card
    percent: p,
    avatars: getAvatars(u, a, d),
    background: getBackground(p)
  });

  if (!image) throw createError({ statusCode: 404, message: "Not Found" });

  setResponseHeaders(event, {
    "Content-Type": "image/png"
  });

  return image;
}, { maxAge: 86400 });
