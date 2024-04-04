const angarEmojis = {
  angarMonkas: "1225312393958133932",
  angarSad: "1225312395354701824",
  angarGasm: "1225312390061752410",
  angarL: "1225312393240907806",
  angarShy: "1225313748923973755",
  angarSadge: "1225312453164929096",
  angarG: "1225312387092054036",
  angarJu: "1225312391995199589",
  angarH: "1225312391030374450.",
  angarG2: "1225312388501344266",
  Cheer100: "1053629269194047488",
  Cheer1k: "1053629071935938590",
  Cheer5k: "1053628502135549972",
  Cheer10k: "1053627826655461457",
  Cheer25k: "1053624911693881344",
  Cheer50k: "1053628988293136526"
};

export const getEmoji = (name) => {
  return name in angarEmojis ? `<:${name}:${angarEmojis[name]}>` : "";
};

export const getEmojiURL = (name) => {
  return name in angarEmojis ? `https://cdn.discordapp.com/emojis/${angarEmojis[name]}.webp` : "";
};

const socials = {
  instagram: "<:instagram:1121001080470372422>",
  tiktok: "<:tiktok:1121003232345473065>",
  /* twitter: "<:twitter:1120999580167852094>", */
  facebook: "<:facebook:1135326667158585434>",
  twitter: "<:xcom:1135473765443186708>",
  youtube: "<:youtube:1140938633369628703>",
  twitch: "<:twitch:1167239427987361822>"
};

export const getSocial = (name) => {
  const key = name.toLowerCase();
  return key in socials ? socials[key] : "";
};
