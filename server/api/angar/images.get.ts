export default defineCachedEventHandler(async () => {
  const images = await hubBlob().list({ prefix: "angar" });
  return images.blobs.sort((a, b) => {
    return a.uploadedAt.getTime() - b.uploadedAt.getTime();
  }).map(images => images.pathname);
}, {
  swr: false,
  maxAge: 86400, // 1 day
  group: "api",
  name: "angar-images",
  getKey: () => "all"
});
