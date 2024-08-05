/**
 * Cloudflare worker.
 */
import { IttyRouter } from "itty-router";
import { verifyKey, ButtonStyleTypes, MessageComponentTypes, InteractionType } from "discord-interactions";
import { hash } from "ohash";
import { withQuery } from "ufo";
import { $fetch } from "ofetch";
import { create, reply, error, deferReply, deferUpdate } from "./interaction.js";
import { getValue, getRandom, esUrl, imbedUrlsFromString, errorEmbed, getRandomAngar, getRandomBuenoGente, getRandomAngarMessage } from "./functions.js";
import * as C from "./commands.js";
import { getEmoji, getEmojiURL, getSocial, getLeagueEmblem, getLolSpell } from "./emojis.js";
import { avatar, guide, yizack } from "./images.js";
import { CONSTANTS } from "./constants.js";

const { COLOR, CHANNEL, CHANNEL_PRUEBAS, BOT, VOZ, OWNER, VIDEO_SOCIALS } = CONSTANTS;
const allow = true;

const router = IttyRouter();

router.get("/", (req, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post("/", async (req, env, context) => {
  const { type, data, member, guild_id, channel_id, token } = await req.json();
  if (type === InteractionType.PING) {
    /**
     * The `PING` message is used during the initial webhook handshake, and is
       required to configure the webhook in the developer portal.
     */
    console.info("Handling Ping request");
    return create(type);
  }

  if (channel_id === CHANNEL || channel_id === CHANNEL_PRUEBAS || allow) {
    return create(type, async () => {
      const { name, options, resolved } = data;

      switch (name) {
      // Comando /memide
        case C.ME_MIDE.name: {
          const cm = getRandom({ max: 32 });
          const emoji = cm >= 15 ? getEmoji("angarMonkas") : getEmoji("angarSad");
          return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
        }
        // Comando /mecabe
        case C.ME_CABE.name: {
          const cm = getRandom({ max: 43 });
          const emoji = cm >= 10 ? getEmoji("angarGasm") : getEmoji("angarL");
          return reply(`A <@${member.user.id}> le caben **${cm}** centímetros. ${emoji}`);
        }
        // Comando /cheer
        case C.CHEER.name: {
          const mensaje = getValue("mensaje", options).replace(/(<([^>]+)>)/gi, "").trim();
          const bits = [
            getEmojiURL("Cheer100"),
            getEmojiURL("Cheer1k"),
            getEmojiURL("Cheer5k"),
            getEmojiURL("Cheer10k"),
            getEmojiURL("Cheer25k"),
            getEmojiURL("Cheer50k")
          ];
          if (mensaje.length > 500) return reply(`<@${member.user.id}> El mensaje no puede tener más de 500 caracteres.`);
          const followUpRequest = async () => {
            const text = encodeURIComponent(mensaje);
            const response = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=${VOZ}&text=${text}`);
            const blob = await response.blob();
            const files = [{ name: `${hash(text)}.mp3`, file: blob }];

            return deferUpdate("", {
              embeds: [{
                description: `\`${mensaje}\``,
                color: COLOR,
                author: {
                  name: `${member.user.username}`,
                  icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                },
                thumbnail: {
                  url: getEmojiURL("angarG2")
                },
                footer: {
                  text: `Voz: ${VOZ}. Caracteres: ${mensaje.length} de 500.`,
                  icon_url: bits[getRandom({ min: 0, max: bits.length - 1 })]
                }
              }],
              token,
              application_id: env.DISCORD_APPLICATION_ID,
              files
            });
          };

          context.waitUntil(followUpRequest());
          return deferReply();
        }
        // Comando /educar
        case C.EDUCAR.name: {
          const usuario = getValue("usuario", options);

          let message = `<@${member.user.id}> no ha podido educar a <@${usuario}>`;
          let embeds = [];

          const percent = getRandom({ max: 100 });
          if (percent < 33) {
            const key = guild_id + "-" + usuario;

            let counter = Number(await env.EDUCAR.get(key));
            counter = counter ? counter + 1 : 1;
            await env.EDUCAR.put(key, counter);

            const veces = counter === 1 ? "vez" : "veces";

            message = `<@${usuario}> te educaron.`;
            embeds.push({
              description: `**${member.user.username}** ha educado a **<@${usuario}>**.\n*<@${usuario}> ha sido educado **${counter}** ${veces} en total.*`,
              color: COLOR
            });
          }
          return reply(message, { embeds: embeds });
        }
        // comando /comandos
        case C.COMANDOS.name: {
          let list = [];
          Object.values(C).forEach((command) => {
            list.push(`-  </${command.name}:${command.cid}> *${command.description}*\n\n`);
          });

          return reply(null, { embeds: [{
            title: "Lista de comandos",
            description: "Conoce la lista de comandos disponibles.\n\n"
            + `${list.join("")}`
            + "Escribe el comando que desees en la caja de enviar mensajes de discord y selecciona la opción que se muestra junto al avatar del bot. Se irán añadiendo más comandos divertidos con el tiempo.",
            color: COLOR,
            author: {
              name: BOT,
              icon_url: avatar
            },
            image: {
              url: guide
            },
            footer: {
              text: `Creado por ${OWNER}.`,
              icon_url: yizack
            }
          }] });
        }
        // comando /buenogente
        case C.BUENO_GENTE.name: {
          return reply(null, { embeds: [{
            title: "🖐 ANGAR se ha despedido con un \"BUENO GENTE\"",
            description: "¡Bueno gente! 🖐🖐👊",
            color: COLOR,
            author: {
              name: BOT,
              icon_url: avatar
            },
            image: {
              url: getRandomBuenoGente()
            }
          }] });
        }
        // comando /ship
        case C.SHIP.name: {
          const u1 = getValue("persona1", options);
          const u2 = getValue("persona2", options);
          const p = getRandom({ min: 0, max: 100 });
          const { users } = resolved;
          const letras_nombre1 = users[u1].username.substring(0, 3);
          const letras_nombre2 = users[u2].username.substring(users[u2].username.length - 2);
          const nombre_ship = `${letras_nombre1}${letras_nombre2}`;
          const params = {
            u: [u1, u2].map(String),
            a: [users[u1].avatar, users[u2].avatar],
            d: [users[u1].discriminator, users[u2].discriminator].map(Number),
            p
          };
          const code = btoa(JSON.stringify(params));
          const image = `https://dodoria.yizack.com/api/ship/${code}`;
          let emoji = getEmoji("angarSad");
          if (p >= 90) {
            emoji = getEmoji("angarH");
          }
          else if (p >= 70 && p < 90) {
            emoji = getEmoji("angarShy");
          }
          else if (p >= 50 && p < 70) {
            emoji = getEmoji("angarJu");
          }
          else if (p >= 30 && p < 50) {
            emoji = getEmoji("angarG");
          }
          else if (p >= 10 && p < 30) {
            emoji = getEmoji("angarSadge");
          }
          return reply(`Ship entre <@${u1}> y <@${u2}>. ${emoji}`, {
            embeds: [{
              color: COLOR,
              description: `❤️ | <@${u1}> y <@${u2}> son **${p}%** compatibles.\n❤️ | El nombre del ship es **${nombre_ship}**.`,
              image: {
                url: image
              }
            }]
          });
        }
        /* // comando /fuck
        case C.FUCK.name: {
          if (channel_id === CHANNEL_FUCK || channel_id === CHANNEL_FUCK_TEST) {
            const usuario = getValue("usuario", options);
            const mensaje = `<@${member.user.id}> se ha follado a <@${usuario}>. ${getEmoji("angarGasm")}`;

            const key = guild_id + "-" + usuario;
            const image = fuck[getRandom({min: 0, max: fuck.length - 1})];
            let counter = Number(await env.FUCK.get(key));
            counter = counter ? counter + 1 : 1;
            await env.FUCK.put(key, counter);

            const veces = counter === 1 ? "vez" : "veces";

            const { users } = resolved;
            const username = users[usuario].username;

            return reply(mensaje , {
              embeds: [{
                color: COLOR,
                description: `<@${member.user.id}> le ha dado tremenda cogida a <@${usuario}>. ${getEmoji("angarGasm")}`,
                image: {
                  url: image
                },
                footer: {
                  text: `Se han cogido a ${username} ${counter} ${veces} en total.`
                }
              }]
            });
          }
          break;
        }
        // comando /ia
        case C.IA.name: {
          try {
            const mensaje = getValue("mensaje", options);
            const respuesta = await getIA(`${member.user.username} says:\n${mensaje}`, env.IA_CHAT);
            return reply(`<@${member.user.id}>. ${respuesta}`);
          } catch (error) {
            console.info(error);
          }
          break;
        }
        */
        case C.VIDEO.name: {
          const followUpRequest = async () => {
            const embeds = [], button = [], components = [];
            let emoji;
            let supported = false;
            let red_social = "Instagram / Facebook / TikTok / X / YouTube / Twitch / Kick";
            const url = getValue("link", options);

            for (const key in VIDEO_SOCIALS) {
              const sns = VIDEO_SOCIALS[key];
              if (sns.domains.some(domains => url.includes(domains))) {
                red_social = sns.name;
                emoji = getSocial(red_social);
                supported = true;
                break;
              }
            }

            if (!esUrl(url) && !supported) {
              const error = `⚠️ Error. El texto ingresado no es un link válido de **${red_social}**`;
              return deferUpdate("", {
                token,
                application_id: env.DISCORD_APPLICATION_ID,
                embeds: errorEmbed(error)
              });
            }

            const encodedUrl = encodeURIComponent(url);
            const scraperUrl = `https://dev.ahmedrangel.com/dc/${red_social.toLowerCase()}-video-scrapper`;
            const scraperQueries = { url: encodedUrl, filter: "video" };
            const scrapping = await $fetch(withQuery(scraperUrl, scraperQueries), { retry: 3, retryDelay: 1000 }).catch(() => null);
            const { id, video_url, short_url, status } = scrapping;
            const caption = imbedUrlsFromString(`${scrapping?.caption ? scrapping?.caption?.replace(/#[^\s#]+(\s#[^\s#]+)*$/g, "").replaceAll(".\n", "").replace(/\n+/g, "\n").trim() : ""}`);

            if (status !== 200 && !esUrl(video_url)) {
              const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
              return deferUpdate("", {
                token,
                application_id: env.DISCORD_APPLICATION_ID,
                embeds: errorEmbed(error)
              });
            }

            const finalReply = (downloadUrl) => {
              button.push({
                type: MessageComponentTypes.BUTTON,
                style: ButtonStyleTypes.LINK,
                label: "Descargar MP4",
                url: downloadUrl
              });

              components.push ({
                type: MessageComponentTypes.ACTION_ROW,
                components: button
              });

              const mensaje = `${emoji} **${red_social}**: [${short_url.replace("https://", "")}](${withQuery("https://dev.ahmedrangel.com/dc/fx", { video_url: downloadUrl, redirect_url: short_url })})\n${caption}`;
              const fixedMsg = mensaje.length > 1000 ? mensaje.substring(0, 1000) + "..." : mensaje;

              return deferUpdate(fixedMsg, {
                token,
                application_id: env.DISCORD_APPLICATION_ID,
                embeds,
                components
              });
            };

            const cdnUrl = `https://cdn.ahmedrangel.com/videos/${red_social.toLowerCase()}/${id}.mp4`;
            const checkCdn = await $fetch.raw(cdnUrl).catch(() => null);
            if (checkCdn?.ok) {
              console.info("Existe en CDN");
              return finalReply(cdnUrl);
            }

            const videoChecker = await $fetch.raw(video_url).catch(() => null);
            const blob = videoChecker?._data;
            const fileSize = blob?.size;
            const contentType = videoChecker?.headers.get("content-type");
            console.info("Tamaño: " + fileSize, "Content-Type: " + contentType);

            const maxSize = 100000000;

            if (blob && fileSize > maxSize) {
              const error = "⚠️ Error. El video es muy pesado o demasiado largo.";
              return deferUpdate("", {
                token,
                application_id: env.DISCORD_APPLICATION_ID,
                embeds: errorEmbed(error)
              });
            }

            if (!blob || fileSize < 100 || !["video/mp4", "binary/octet-stream", "application/octet-stream"].includes(contentType)) {
              const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
              return deferUpdate("", {
                token,
                application_id: env.DISCORD_APPLICATION_ID,
                embeds: errorEmbed(error)
              });
            }

            const uploadedUrl = await $fetch(withQuery("https://dev.ahmedrangel.com/put/video", { url: video_url, prefix: "videos", dir: red_social.toLowerCase(), file_id: id }));
            return finalReply(uploadedUrl);
          };
          context.waitUntil(followUpRequest());
          return deferReply();
        }
        case C.LOLPROFILE.name: {
          const followUpRequest = async () => {
            const riotId = (getValue("riot_id", options)).replace(/ /g, "").split("#");
            const region = getValue("servidor", options);
            const riotName = riotId[0];
            const riotTag = riotId[1];
            if (!riotTag || !riotName) {
              return deferUpdate("", { token, application_id: env.DISCORD_APPLICATION_ID,
                embeds: [{
                  color: COLOR,
                  description: ":x: Ingrese correctamente el **Riot ID**. Ej: **Name#TAG**"
                }]
              });
            }
            const embeds = [];
            let components = [];
            let button = [];
            let mensaje = "";
            let remake, footer, titleName;

            const profileF = await fetch(`https://dev.ahmedrangel.com/lol/profile/${region}/${riotName}/${riotTag}`);
            const profile = await profileF.json();
            if (profile.status_code !== 404) {
              if (profile.titleName !== "") {
                titleName = `*${profile.titleName}*`;
              }
              else {
                titleName = "";
              }
              let queue = "";
              const nivel = {
                name: "Nivel",
                value: `${profile.summonerLevel}`,
                inline: true
              };
              const history = [];
              const fields = [];
              profile.rankProfile.forEach((rank) => {
                if (rank.queueType == "RANKED_SOLO_5x5") {
                  queue = "Solo/Duo";
                }
                else if (rank.queueType == "RANKED_FLEX_SR") {
                  queue = "Flexible";
                }
                else if (rank.queueType == "RANKED_TFT_DOUBLE_UP") {
                  queue = "TFT Dúo Dinámico";
                }
                const winrate = Math.round((rank.wins / (rank.wins + rank.losses)) * 100);
                const tierEmoji = getLeagueEmblem(rank.tier);
                let rankNumber;
                if (rank.tier == "MAESTRO" || rank.tier == "GRAN MAESTRO" || rank.tier == "RETADOR") {
                  rankNumber = "";
                }
                else {
                  rankNumber = rank.rank;
                }
                fields.push({
                  name: `${queue}: ${tierEmoji} ${rank.tier.toUpperCase()} ${rankNumber}`,
                  value: `${rank.leaguePoints} LP・${rank.wins}V - ${rank.losses}D **(${winrate}% WR)**`,
                  inline: true
                });
              });

              profile.matchesHistory.forEach((match) => {
                let resultado;
                if (match.remake) {
                  resultado = "⬜";
                  remake = true;
                }
                else {
                  resultado = match.win ? "🟦" : "🟥";
                }
                const championName = match.championName.replaceAll(" ", "");
                const k = match.kills;
                const d = match.deaths;
                const a = match.assists;
                const queueName = match.queueName;
                const strTime = match.strTime;
                const spell1 = getLolSpell(match.summoner1Id);
                const spell2 = getLolSpell(match.summoner2Id);
                history.push(`${resultado} ${spell1}${spell2} ${championName}・**${k}/${d}/${a}**・${queueName}・*${strTime}*`);
              });
              fields.push({
                name: "Partidas recientes:",
                value: history.join("\n"),
                inline: false
              });
              if (remake) {
                footer = "🟦 = victoriaㅤ🟥 = derrotaㅤ⬜ = remake";
              }
              else {
                footer = "🟦 = victoriaㅤ🟥 = derrota";
              }
              embeds.push({
                type: "rich",
                title: profile.region.toUpperCase(),
                description: `${titleName}`,
                color: COLOR,
                fields: [nivel, ...fields],
                author: {
                  name: `${profile.riotName} #${profile.riotTag}`,
                  icon_url: profile.profileIconUrl
                },
                footer: {
                  text: footer,
                  icon_url: "https://cdn.ahmedrangel.com/LOL_Icon.png"
                }
              });
              button.push(
                {
                  type: MessageComponentTypes.BUTTON,
                  style: ButtonStyleTypes.LINK,
                  label: "Ver en OP.GG",
                  url: `https://op.gg/summoners/${profile.region}/${encodeURIComponent(profile.riotName)}-${encodeURIComponent(profile.riotTag)}`
                } /*
                {
                  type: MessageComponentTypes.BUTTON,
                  style: ButtonStyleTypes.LINK,
                  label: "Ver en U.GG",
                  url: `https://u.gg/lol/profile/${profile.route}/${encodeURIComponent(profile.summonerName)}/overview`
                } */);
              components.push({
                type: MessageComponentTypes.ACTION_ROW,
                components: button
              });
            }
            else {
              let errorName;
              switch (profile.errorName) {
                case "riotId":
                  errorName = "No se ha encontrado el **Riot ID**.";
                  break;
                case "region":
                  errorName = "La **región** ingresada es incorrecta.";
                  break;
              }
              embeds.push({
                color: COLOR,
                description: `:x: Error. ${errorName}`
              });
            }
            console.info(embeds);
            // Return del refer
            return deferUpdate(mensaje, {
              token,
              application_id: env.DISCORD_APPLICATION_ID,
              embeds,
              components
            });
          };

          context.waitUntil(followUpRequest());
          return deferReply();
        }
        case C.LOLMMR.name: {
          const followUpRequest = async () => {
            const riotId = (getValue("riot_id", options)).replace(/ /g, "").split("#");
            const region = getValue("servidor", options);
            const queue = getValue("cola", options);
            const riotName = riotId[0];
            const riotTag = riotId[1];
            if (!riotTag || !riotName) {
              return deferUpdate("", { token, application_id: env.DISCORD_APPLICATION_ID,
                embeds: [{
                  color: COLOR,
                  description: ":x: Ingrese correctamente el **Riot ID**. Ej: **Name#TAG**"
                }]
              });
            }
            const embeds = [];
            let mensaje = "";
            let footer;
            const profileF = await fetch(`https://dev.ahmedrangel.com/lol/mmr/${region}/${riotName}/${riotTag}/${queue}`);
            const profile = await profileF.json();
            if (profile.status_code !== 404) {
              const queueName = profile.ranked.queueName === "Flex" ? "Flexible" : "Solo/Duo";
              const tierEmoji = getLeagueEmblem(profile?.ranked?.tier);
              const avgTierEmoji = getLeagueEmblem(profile?.avg?.tier);
              const wins = profile?.ranked.wins;
              const losses = profile?.ranked.losses;
              const winrate = Math.round((wins / (wins + losses)) * 100);
              embeds.push({
                type: "rich",
                title: profile?.region.toUpperCase(),
                color: COLOR,
                fields: [
                  {
                    name: `${queueName}: ${tierEmoji} ${profile?.ranked?.tier.toUpperCase()} ${profile?.ranked?.rank}`,
                    value: `${profile?.ranked?.leaguePoints} LP・${wins}V - ${losses}D **(${winrate}% WR)**`,
                    inline: false
                  },
                  {
                    name: `ELO MMR aproximado: ${avgTierEmoji} ${profile?.avg?.tier.toUpperCase()} ${profile?.avg?.rank}`,
                    value: "",
                    inline: false
                  }
                ],
                author: {
                  name: `${profile?.riotName} #${profile?.riotTag}`,
                  icon_url: profile?.profileIconUrl
                },
                footer: {
                  text: footer,
                  icon_url: "https://cdn.ahmedrangel.com/LOL_Icon.png"
                }
              });
            }
            else {
              let errorName;
              switch (profile?.errorName) {
                case "riotId":
                  errorName = "No se ha encontrado el **Riot ID**.";
                  break;
                case "region":
                  errorName = "La **región** ingresada es incorrecta.";
                  break;
                case "ranked":
                  errorName = `La cuenta es **unranked** en **${queue}**`;
                  break;
              }
              embeds.push({
                color: COLOR,
                description: `:x: Error. ${errorName}`
              });
            }
            console.info(embeds);
            // Return del refer
            return deferUpdate(mensaje, {
              token,
              application_id: env.DISCORD_APPLICATION_ID,
              embeds
            });
          };

          context.waitUntil(followUpRequest());
          return deferReply();
        }
        case C.ANGAR.name: {
          const button = [{
            type: MessageComponentTypes.BUTTON,
            style: ButtonStyleTypes.LINK,
            label: "Ver galería",
            url: "https://dodoria.yizack.com/c/angar"
          }];

          const components = [{
            type: MessageComponentTypes.ACTION_ROW,
            components: button
          }];

          return reply(null, {
            components,
            embeds: [{
              title: getRandomAngarMessage(),
              description: "",
              color: COLOR,
              author: {
                name: `${member.user.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
              },
              image: {
                url: getRandomAngar()
              }
            }]
          });
        }
        default:
          return error("Unknown Type", 400);
      }
    });
  }
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  async fetch (request, env, context) {
    const { method, headers } = request;
    if (method === "POST") {
      const signature = headers.get("x-signature-ed25519");
      const timestamp = headers.get("x-signature-timestamp");
      const body = await request.clone().arrayBuffer();
      const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        env.DISCORD_PUBLIC_KEY
      );
      if (!isValidRequest) {
        return new Response("Bad request signature.", { status: 401 });
      }
    }
    return router.fetch(request, env, context);
  }
};
