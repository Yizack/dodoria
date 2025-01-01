export default defineEventHandler(async (event) => {
  const blob = await useStorage().getItemRaw<Blob>("root/public/copys/n_DWT3Y6FUTP.ogg");
  console.log(blob);
  return Boolean(blob);
});
