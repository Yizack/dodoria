import { Resvg, initWasm } from "@resvg/resvg-wasm";
// @ts-expect-error - ignore wasm file check
import resvgwasm from "@resvg/resvg-wasm/index_bg.wasm?module";

export const getAvatars = (
  u: string[],
  a: (string | null)[],
  d: number[]
) => ({
  u1: getAvatarURL({
    userId: u[0]!,
    avatarHash: a[0]!,
    userDiscriminator: d[0]!
  }),
  u2: getAvatarURL({
    userId: u[1]!,
    avatarHash: a[1]!,
    userDiscriminator: d[1]!
  })
});

export const getBackground = (percent: number) => {
  let background = "0";
  switch (true) {
    case percent >= 90:
      background = "90";
      break;
    case percent >= 70 && percent < 90:
      background = "70";
      break;
    case percent >= 50 && percent < 70:
      background = "50";
      break;
    case percent >= 30 && percent < 50:
      background = "30";
      break;
    case percent >= 10 && percent < 30:
      background = "10";
      break;
  }
  return `${SITE.host}/images/ship/${background}.jpg`;
};

const getPercentX = (value: number) => {
  if (value >= 100) {
    return 252;
  }
  else if (value >= 10) {
    return 265;
  }
  return 275;
};

const getBase64Image = async (url: string) => {
  const buffer = await $fetch<ArrayBuffer>(url, { responseType: "arrayBuffer" });
  return Buffer.from(buffer).toString("base64");
};

export const getShipImage = async (data: {
  percent: number;
  avatars: {
    u1: string;
    u2: string;
  };
  background: string;
}) => {
  try {
    const { background, avatars, percent } = data;
    const font = await useStorage("assets/server/fonts").getItemRaw("OpenSans.ttf");
    const backgroundBase64 = await getBase64Image(background);
    const avatar1Base64 = avatars ? await getBase64Image(avatars.u1) : "";
    const avatar2Base64 = avatars ? await getBase64Image(avatars.u2) : "";
    const fontUint8Array = new Uint8Array(font);
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="610" height="200" viewBox="0 0 610 200" fill="none" role="img">
      <defs>
        <clipPath id="persona1">
          <circle cx="122.5" cy="100" r="80" />
        </clipPath>
        <clipPath id="persona2">
          <circle cx="487.5" cy="100" r="80" />
        </clipPath>
      </defs>
      <image href="data:image/jpeg;base64,${backgroundBase64}" x="0" y="0" width="610" height="200" preserveAspectRatio="none" />
      <rect x="15" y="15" width="580" height="170" rx="20" opacity="0.5" fill="#000000"/>
      <g transform="translate(215, 20)">
        <path fill="#000000" opacity="0.5" d="M 82.355 151.231 C 78.533 146.948 68.989 138.598 61.146 132.675 C 37.91 115.128 34.747 112.588 25.312 103.901 C 7.92 87.885 0.534 71.795 0.559 49.978 C 0.571 39.327 1.297 35.225 4.279 28.946 C 9.339 18.295 16.794 10.38 26.323 5.54 C 33.073 2.112 36.401 0.589 47.673 0.527 C 59.463 0.462 61.945 1.836 68.881 5.647 C 77.323 10.283 86.012 20.196 87.808 27.236 L 88.918 31.585 L 91.653 25.595 C 107.114 -8.247 156.47 -7.742 173.646 26.438 C 179.095 37.28 179.693 60.43 174.862 73.471 C 168.558 90.484 156.72 103.452 129.355 123.327 C 111.408 136.36 91.095 156.081 89.682 158.85 C 88.04 162.066 89.603 159.354 82.355 151.231 Z"/>
      </g>
      <g transform="translate(${getPercentX(percent)}, 110)">
        <text x="0" y="0" fill="#ffffff" font-family="sans-serif" font-size="40px" font-weight="600">${percent >= 0 ? percent + "%" : ""}</text>
      </g>
      <g>
        <circle cx="122.5" cy="100" r="80" stroke="#ffffff" stroke-width="3" />
        <circle cx="487.5" cy="100" r="80" stroke="#ffffff" stroke-width="3" />
      </g>
      <image href="data:image/png;base64,${avatar1Base64}" clip-path="url(#persona1)" x="42.5" y="20" width="160" height="160" preserveAspectRatio="xMidYMid slice" />
      <image href="data:image/png;base64,${avatar2Base64}" clip-path="url(#persona2)" x="407.5" y="20" width="160" height="160" preserveAspectRatio="xMidYMid slice" />
    </svg>`.trim();
    await initWasm(resvgwasm as WebAssembly.Module).catch(() => { /* already initialized */ });
    const opts = {
      font: {
        loadSystemFonts: false,
        fontBuffers: [fontUint8Array],
        sansSerifFamily: "Open Sans"
      }
    };

    const resvg = new Resvg(svg, opts);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    return pngBuffer;
  }
  catch (e) {
    console.warn(e);
    return;
  }
};

export const decodeCode = (encodedCode: string) => {
  try {
    const decodedString = atob(encodedCode);
    const params = JSON.parse(decodedString);

    const paramsSchema = z.object({
      p: z.number({ coerce: true }).int().min(0).max(100),
      u: z.array(z.string()).length(2),
      a: z.array(z.string().nullable()).length(2),
      d: z.array(z.number()).length(2)
    });

    const decodedParams = {
      p: params.p,
      u: params.u,
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
