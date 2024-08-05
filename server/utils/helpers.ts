// import { svg2png, initialize } from "svg2png-wasm";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { SITE as siteInfo } from "~/utils/site-info";

export { z } from "zod";
export const SITE = siteInfo;

export const getAvatar = (u: string, a: string, d: string) => {
  if (u && d) {
    const user = u.split(",");
    const avatar = a ? a.split(",") : "";
    const discriminator = d.split(",").map(Number);
    return {
      u1: avatar[0] ? `https://cdn.discordapp.com/avatars/${user[0]}/${avatar[0]}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${discriminator[0] % 5}.png`,
      u2: avatar[1] ? `https://cdn.discordapp.com/avatars/${user[1]}/${avatar[1]}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${discriminator[1] % 5}.png`
    };
  }
  return null;
};

export const getBackground = (percent: number) => {
  let background = "0";
  if (percent >= 90) {
    background = "90";
  }
  else if (percent >= 70 && percent < 90) {
    background = "70";
  }
  else if (percent >= 50 && percent < 70) {
    background = "50";
  }
  else if (percent >= 30 && percent < 50) {
    background = "30";
  }
  else if (percent >= 10 && percent < 30) {
    background = "10";
  }
  return `${SITE.url}/images/ship/${background}.jpg`;
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

export const getBase64Image = async (url: string) => {
  const buffer = await $fetch(url, { responseType: "arrayBuffer" }) as ArrayBuffer;
  return Buffer.from(buffer).toString("base64");
};

export const getImage = async (data: {
  p: number;
  avatar: null | {
    u1: string;
    u2: string;
  };
  background: string;
}) => {
  try {
    const { background, avatar, p } = data;
    const backgroundBase64 = await getBase64Image(background);
    const avatar1Base64 = avatar ? await getBase64Image(avatar.u1) : "";
    const avatar2Base64 = avatar ? await getBase64Image(avatar.u2) : "";
    const font = await $fetch(`${SITE.url}/assets/OpenSans.ttf`, { responseType: "arrayBuffer" }) as ArrayBuffer;
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
      <g transform="translate(${getPercentX(p)}, 110)">
        <text x="0" y="0" fill="#ffffff" font-family="sans-serif" font-size="40px" font-weight="600">${Number(p) >= 0 ? p + "%" : ""}</text>
      </g>
      <g>
        <circle cx="122.5" cy="100" r="80" stroke="#ffffff" stroke-width="3" />
        <circle cx="487.5" cy="100" r="80" stroke="#ffffff" stroke-width="3" />
      </g>
      <image href="data:image/png;base64,${avatar1Base64}" clip-path="url(#persona1)" x="42.5" y="20" width="160" height="160" preserveAspectRatio="xMidYMid slice" />
      <image href="data:image/png;base64,${avatar2Base64}" clip-path="url(#persona2)" x="407.5" y="20" width="160" height="160" preserveAspectRatio="xMidYMid slice" />
    </svg>`.trim();
    const resvgwasm = await $fetch(`${SITE.url}/assets/resvg.wasm`, { responseType: "arrayBuffer" }) as ArrayBuffer;
    await initWasm(resvgwasm as WebAssembly.Module);
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
    /*
    const wasm = await $fetch(`${SITE.url}/assets/svg2png_wasm_bg.wasm`, { responseType: "arrayBuffer" }) as ArrayBuffer;
    await initialize(wasm);
    const png = await svg2png(svg, {
      width: 610,
      height: 200,
      fonts: [fontUint8Array],
      defaultFontFamily: {
        sansSerifFamily: "Open Sans"
      }
    });
    return png;
    */
  }
  catch (e) {
    console.warn(e);
    return;
  }
};
