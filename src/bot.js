/**
 * Cloudflare worker.
 */
import { IttyRouter } from "itty-router";
import { verifyKey } from "discord-interactions";
import { create, reply, error, deferReply, deferUpdate, getGuild } from "./interaction.js";
import { getValue, getRandom, esUrl, imbedUrlsFromString, obtenerIDDesdeURL, errorEmbed } from "./functions.js";
import * as C from "./commands.js";
import { getEmoji, getEmojiURL, getSocial } from "./emojis.js";
import { avatar, guide, yizack, buenogente, fuck } from "./images.js";
import { CONSTANTS } from "./constants.js";
import { ButtonStyleTypes, MessageComponentTypes, InteractionType } from "discord-interactions";
import { hash } from "ohash";

const { COLOR, CHANNEL, CHANNEL_PRUEBAS, CHANNEL_FUCK, CHANNEL_FUCK_TEST, BOT, VOZ, OWNER, VIDEO_SOCIALS } = CONSTANTS;
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
    console.log("Handling Ping request");
    return create(type);
  }

  if (channel_id === CHANNEL || channel_id === CHANNEL_PRUEBAS || allow) {
    return create(type, async () => {
      const { name, options, resolved } = data;

      switch (name) {
        // Comando /memide
        case C.ME_MIDE.name: {
          const cm = getRandom({max: 32});
          const emoji = cm >= 15 ? getEmoji("angarMonkas") : getEmoji("angarSad");
          return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
        }
        // Comando /mecabe
        case C.ME_CABE.name: {
          const cm = getRandom({max: 43});
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
              embeds : [{
                description: `\`${mensaje}\``,
                color: COLOR,
                author: {
                  name: `${member.user.username}#${member.user.discriminator}`,
                  icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                },
                thumbnail: {
                  url: getEmojiURL("angarG2")
                },
                footer: {
                  text: `Voz: ${VOZ}. Caracteres: ${mensaje.length} de 500.`,
                  icon_url: bits[getRandom({min: 0, max: bits.length - 1})]
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

          const percent = getRandom({max: 100});
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
            description: "Conoce la lista de comandos disponibles.\n\n" +
                          `${list.join("")}` +
                          "Escribe el comando que desees en la caja de enviar mensajes de discord y selecciona la opción que se muestra junto al avatar del bot. Se irán añadiendo más comandos divertidos con el tiempo.",
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
          }]});
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
              url: buenogente[getRandom({min: 0, max: buenogente.length - 1})]
            }
          }]});
        }
        // comando /ship
        case C.SHIP.name: {
          const u1 = getValue("persona1", options);
          const u2 = getValue("persona2", options);
          const p = getRandom({min: 0, max: 100});
          const { users } = resolved;
          const letras_nombre1 = users[u1].username.substring(0, 3);
          const letras_nombre2 = users[u2].username.substring(users[u2].username.length - 2);
          const nombre_ship = `${letras_nombre1}${letras_nombre2}`;
          const image = `https://dodoria-ship.vercel.app/api?u=${[u1, u2]}&a=${[users[u1].avatar, users[u2].avatar]}&d=${[users[u1].discriminator, users[u2].discriminator]}&p=${p}`;
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
        // comando /fuck
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
        /*
        case C.IA.name: {
          try {
            const mensaje = getValue("mensaje", options);
            const respuesta = await getIA(`${member.user.username} says:\n${mensaje}`, env.IA_CHAT);
            return reply(`<@${member.user.id}>. ${respuesta}`);
          } catch (error) {
            console.log(error);
          }
          break;
        }
        */
        case C.VIDEO.name: {
          const followUpRequest = async () => {
            let mensaje, emoji;
            let embeds = [], files = [], button = [], components = [];
            let supported = false;
            let red_social = "Instagram / Facebook / TikTok / Twitter / YouTube / Twitch";
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
            if (esUrl(url) && supported == true) {
              const encodedUrl = encodeURIComponent(url);
              const scrappingUrl = `https://dev.ahmedrangel.com/dc/${red_social.toLowerCase()}-video-scrapper?url=${encodedUrl}&filter=video`;
              const scrapping = await fetch(scrappingUrl);
              const json_scrapped = await scrapping.json();
              const url_scrapped = json_scrapped?.video_url;
              const short_url = json_scrapped?.short_url;
              const status = json_scrapped?.status;
              console.log(status);
              if (status === 200 && esUrl(url_scrapped)) {
                let retryCount = 0;
                const fetchScraped = async() => {
                  const sizeCheckerF = await fetch(url_scrapped);
                  const caption = `${json_scrapped?.caption ? json_scrapped?.caption?.replace(/#[^\s#]+(\s#[^\s#]+)*$/g, "").replace(/.\n/g,"").trim() : ""}`;
                  const blob = await sizeCheckerF.blob();
                  const fileSize = blob.size;
                  console.log("Tamaño: " + fileSize);
                  return {blob: blob, fileSize: fileSize, caption: imbedUrlsFromString(caption)};
                };
                let {blob, fileSize, caption} = await fetchScraped();
                while (fileSize < 100 && retryCount < 3) {
                  console.log("El tamaño del archivo es 0. Volviendo a intentar...");
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  ({ blob, fileSize, caption } = await fetchScraped());
                  retryCount++;
                  console.log("Intento: " + retryCount);
                }
                const guild = await getGuild(guild_id, env.DISCORD_TOKEN);
                const maxSize = guild.premium_tier >= 2 ? 50000000 : 25000000;
                if (fileSize > 100 && fileSize < maxSize) {
                  const encodedScrappedUrl = encodeURIComponent(url_scrapped);
                  const upload = await fetch(`https://dev.ahmedrangel.com/put-r2-chokis?video_url=${encodedScrappedUrl}`);
                  const url_uploaded = await upload.text();
                  const urlId = obtenerIDDesdeURL(url_uploaded);
                  files.push({
                    name: `${urlId}.mp4`,
                    file: blob
                  });
                  button.push({
                    type: MessageComponentTypes.BUTTON,
                    style: ButtonStyleTypes.LINK,
                    label: "Descargar MP4",
                    url: url_uploaded
                  });
                  components.push ({
                    type: MessageComponentTypes.ACTION_ROW,
                    components: button
                  });
                  mensaje = `${emoji} **${red_social}**: [${short_url.replace("https://", "")}](<${short_url}>)\n${caption}`;
                } else if (retryCount === 3) {
                  const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
                  embeds = errorEmbed(error);
                } else {
                  const error = "⚠️ Error. El video es muy pesado o demasiado largo.";
                  embeds = errorEmbed(error);
                }
              } else {
                const error = ":x: Error. Ha ocurrido un error obteniendo el video.";
                embeds = errorEmbed(error);
              }
            } else {
              const error = `⚠️ Error. El texto ingresado no es un link válido de **${red_social}**`;
              embeds = errorEmbed(error);
            }
            // Return del refer
            return deferUpdate(mensaje, {
              token,
              application_id: env.DISCORD_APPLICATION_ID,
              embeds,
              components,
              files
            });
          };
          context.waitUntil(followUpRequest());
          return deferReply();
        }
        default:
          return error("Unknown Type", 400);
      }
      
    });
  }
  
});

router.all("*", () => new Response("Not Found.", { status: 404 }));
 
export default {
  async fetch(request, env, context) {
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
  },
};
