export default defineEventHandler(async (event) => {
  const { p, u, a, d } = await getValidatedQuery(event, z.object({
    p: z.number({ coerce: true }).int().min(0).max(100),
    u: z.string(),
    a: z.string(),
    d: z.string()
  }).parse);

  const avatar = getAvatar(u, a, d);
  const card = { // card
    p: p,
    avatar: getAvatar(u, a, d),
    background: getBackground(p)
  };
  const image = await getImage(card); // get Image

  if (!avatar || !image) {
    throw createError({ statusCode: 404, message: "Not Found" });
  }

  setResponseHeaders(event, {
    // "Cache-Control": "max-age=86400",
    "Content-Type": "image/png"
  });

  return image;
});
