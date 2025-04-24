import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const files = await readFormData(event);
  const file = files.get("file") as File;
  const uuid = randomUUID();

  return hubBlob().put(uuid, file, {
    prefix: "angar",
    contentType: file.type
  });
});
