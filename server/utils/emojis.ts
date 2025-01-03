const angarEmojis = {
  angarMonkas: "1272795364381954108",
  angarSad: "1272795422821322835",
  angarGasm: "1272794992225812480",
  angarL: "1272795263609737257",
  angarShy: "1272795811419525130",
  angarSadge: "1272795525644685374",
  angarG: "1272794791196758026",
  angarJu: "1272795177072726046",
  angarH: "1272795082340307037",
  angarG2: "1272794916942118935",
  Cheer100: "1272795893862498314",
  Cheer1k: "1272796036175237151",
  Cheer5k: "1272796077925597234",
  Cheer10k: "1272795983863873536",
  Cheer25k: "1272796123970408509",
  Cheer50k: "1272796169193521235"
};

export const getEmoji = (name: keyof typeof angarEmojis) => {
  return `<:${name}:${angarEmojis[name]}>`;
};

export const getEmojiURL = (name: keyof typeof angarEmojis) => {
  return `https://cdn.discordapp.com/emojis/${angarEmojis[name]}.webp`;
};

const socials = {
  instagram: "<:instagram:1121001080470372422>",
  tiktok: "<:tiktok:1121003232345473065>",
  /* twitter: "<:twitter:1120999580167852094>", */
  facebook: "<:facebook:1135326667158585434>",
  x: "<:xcom:1135473765443186708>",
  youtube: "<:youtube:1140938633369628703>",
  twitch: "<:twitch:1167239427987361822>",
  kick: "<:kick:1267449535668555788>",
  reddit: "<:reddit:1272431634624286730>"
};

export const getSocial = (name: string) => {
  const key = name.toLowerCase() as keyof typeof socials;
  return key in socials ? socials[key] : "";
};

const summonerspells = {
  flash: "<:SFlash:1112207800303620107>",
  heal: "<:SHeal:1112207882809770015>",
  barrier: "<:SBarrier:1112207835523198977>",
  cleanse: "<:SCleanse:1112207847237885982>",
  ignite: "<:SIgnite:1112207858302455929>",
  exhaust: "<:SExhaust:1112207868159078494>",
  ghost: "<:SGhost:1112207818796322967>",
  clarity: "<:SClarity:1112207893626896394>",
  smite: "<:SSmite:1112207904313978951>",
  teleport: "<:STeleport:1112207924215959593>",
  mark: "<:SMark:1112207914644541551>",
  flee: "<:SFlee:1142815344642244688>"
};

const leagueEmblems = {
  iron: "<:Hierro:1112623006087381012>",
  bronce: "<:Bronce:1112621315434754108>",
  silver: "<:Plata:1112621329464688743>",
  gold: "<:Oro:1112621322430857226>",
  platinum: "<:Platino:1143114676566233189>",
  emerald: "<:Esmeralda:1143115170097397801>",
  diamond: "<:Diamante:1112621319754874951>",
  master: "<:Maestro:1112621326289600522>",
  grandmaster: "<:GranMaestro:1112621323789807677>",
  challenger: "<:Retador:1112621316818862100>",
  unranked: "<:Unranked:1155128109981515786>"
};

export const getLolSpell = (number: number) => {
  switch (number) {
    case 1:
      return summonerspells.cleanse;
    case 3:
      return summonerspells.exhaust;
    case 4:
      return summonerspells.flash;
    case 6:
      return summonerspells.ghost;
    case 7:
      return summonerspells.heal;
    case 11:
      return summonerspells.smite;
    case 12:
      return summonerspells.teleport;
    case 13:
      return summonerspells.clarity;
    case 14:
      return summonerspells.ignite;
    case 21:
      return summonerspells.barrier;
    case 32:
      return summonerspells.mark;
    case 2202:
      return summonerspells.flash;
    case 2201:
      return summonerspells.flee;
    default:
      return "";
  }
};

export const getLeagueEmblem = (league: string) => {
  switch (league?.toLowerCase()) {
    case "hierro":
      return leagueEmblems.iron;
    case "bronce":
      return leagueEmblems.bronce;
    case "plata":
      return leagueEmblems.silver;
    case "oro":
      return leagueEmblems.gold;
    case "platino":
      return leagueEmblems.platinum;
    case "esmeralda":
      return leagueEmblems.emerald;
    case "diamante":
      return leagueEmblems.diamond;
    case "maestro":
      return leagueEmblems.master;
    case "gran maestro":
      return leagueEmblems.grandmaster;
    case "retador":
      return leagueEmblems.challenger;
    default:
      return leagueEmblems.unranked;
  }
};
