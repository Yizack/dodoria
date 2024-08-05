export default defineCachedEventHandler(async (event) => {
  const { code } = await getValidatedRouterParams(event, z.object({
    code: z.string()
  }).parse);
  const { p, u, a, d } = decodeCode(code);

  const image = await getImage({
    percent: p,
    avatars: getAvatars(u, a, d),
    background: getBackground(p)
  });

  if (!image) throw createError({ statusCode: 404, message: "Not Found" });
  const truncatedCode = code.slice(0, 10) + Date.now();

  setResponseHeaders(event, {
    "Content-Disposition": `inline; filename="ship-${truncatedCode}.png"`,
    "Content-Type": "image/png"
  });

  return image;
}, { maxAge: 86400 });
