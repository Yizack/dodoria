import { SITE as siteInfo } from "~/utils/site-info";

export { z } from "zod";
export { hash } from "ohash";
export { withQuery } from "ufo";
export { verifyKey, ButtonStyleTypes, MessageComponentTypes, InteractionType } from "discord-interactions";
export const SITE = siteInfo;

export const decodeCode = (encodedCode: string) => {
  try {
    const decodedString = atob(encodedCode);
    const params = JSON.parse(decodedString);

    const paramsSchema = z.object({
      p: z.number({ coerce: true }).int().min(0).max(100),
      u: z.array(z.bigint()).length(2),
      a: z.array(z.string().nullable()).length(2),
      d: z.array(z.number()).length(2)
    });

    const decodedParams = {
      p: params.p,
      u: params.u.map(BigInt),
      a: params.a,
      d: params.d.map(Number)
    };

    const result = paramsSchema.safeParse(decodedParams);

    if (!result.success) throw createError({ statusCode: 400, message: result.error.message });
    return result.data;
  }
  catch (error) {
    console.warn(error);
    throw createError({ statusCode: 400, message: "Invalid image code" });
  }
};
