export default defineEventHandler(async (event) => {
  const { code } = await getValidatedRouterParams(event, z.object({
    code: z.string()
  }).parse);
  const { p, u, a, d } = decodeCode(code);

  const image = await getShipImage({
    percent: p,
    avatars: getAvatars(u, a, d),
    background: getBackground(p)
  });

  if (!image) throw createError({ statusCode: 404, message: "Not Found" });

  setResponseHeaders(event, {
    "Content-Disposition": `inline; filename="ship-${u.join("-")}-${p}.png"`,
    "Content-Type": "image/png",
    "Cache-Control": "max-age=86400"
  });

  return image;
});
