const angarEmojis = {
  angarMonkas: "1053394137707200553",
  angarSad: "1053394389789065329",
  angarGasm: "1053394521993519154",
  angarL: "1053397269925343243",
  angarShy: "1056920698519564318",
  angarSadge: "1056919901622771712",
  angarG: "1056920287205146644",
  angarJu: "1056920315336347658",
  angarH: "1056920858603552820",
  angarG2: "1053622609130049658",
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
