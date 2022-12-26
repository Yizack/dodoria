/**
 * Cloudflare worker.
 */
import { Router } from "itty-router";
import { verifyKey } from "discord-interactions";
import { create, reply, error } from "./interaction.js";
import { getValue, getRandom } from "./functions.js";
import { ME_MIDE, ME_CABE, CHEER, EDUCAR, BUENO_GENTE, SHIP, COMANDOS } from "./commands.js";
import { getEmoji, getEmojiURL } from "./emojis.js";
import { avatar, guide, yizack, buenogente } from "./images.js";
import { CONSTANTS } from "./constants.js";

const { COLOR, CHANNEL, CHANNEL_PRUEBAS, BOT, VOZ, OWNER } = CONSTANTS;

const router = Router();

router.get("/", (req, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});
 
router.post("/", async (req, env) => {
  const { type, data, member, guild_id, channel_id } = await req.json();

  if (channel_id === CHANNEL || channel_id === CHANNEL_PRUEBAS) {
    return create(type, async () => {
      const { name, options, resolved } = data;

      switch (name) {
        // Comando /memide
        case ME_MIDE.name: {
          const cm = getRandom({max: 32});
          const emoji = cm >= 15 ? getEmoji("angarMonkas") : getEmoji("angarSad");
          return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
        }
        // Comando /mecabe
        case ME_CABE.name: {
          const cm = getRandom({max: 43});
          const emoji = cm >= 10 ? getEmoji("angarGasm") : getEmoji("angarL");
          return reply(`A <@${member.user.id}> le caben **${cm}** centímetros. ${emoji}`);
        }
        // Comando /cheer
        case CHEER.name: {
          const mensaje = getValue("mensaje", options).replace(/(<([^>]+)>)/gi, "").trim();
          const bits = [
            getEmojiURL("Cheer100"),
            getEmojiURL("Cheer1k"),
            getEmojiURL("Cheer5k"),
            getEmojiURL("Cheer10k"),
            getEmojiURL("Cheer25k"),
            getEmojiURL("Cheer50k")
          ];
          if (mensaje.length <= 500) {
            const response = await fetch("https://ttsmp3.com/makemp3_new.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: `msg=${encodeURIComponent(mensaje)}&lang=${VOZ}&source=ttsmp3`
            });
            const body = await response.json();
            return reply(`<@${member.user.id}> abre el enlace para escuchar.`, {embeds : [{
              title: "🔊 Escuchar",
              url: body.URL,
              description: `\`${mensaje}\`\n\n*${body.MP3}*`,
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
                icon_url: bits[getRandom({max: bits.length - 1})]
              }
            }]});
          }
          else {
            return reply(`<@${member.user.id}> El mensaje no puede tener más de 500 caracteres.`);
          }
        }
        // Comando /educar
        case EDUCAR.name: {
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
        case COMANDOS.name: {
          return reply(null, { embeds: [{
            title: "Lista de comandos",
            description: "Conoce la lista de comandos disponibles.\n\n" +
                          `-  \`/${CHEER.name}\` *${CHEER.description}*\n\n` + 
                          `-  \`/${ME_MIDE.name}\` *${ME_MIDE.description}*\n\n` +
                          `- \`/${ME_CABE.name}\` *${ME_CABE.description}*\n\n` +
                          `- \`/${EDUCAR.name}\` *${EDUCAR.description}*\n\n` +
                          `- \`/${BUENO_GENTE.name}\` *${BUENO_GENTE.description}*\n\n` +
                          `- \`/${SHIP.name}\` *${SHIP.description}*\n\n\n` +
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
        case BUENO_GENTE.name: {
          return reply(null, { embeds: [{
            title: "🖐 ANGAR se ha despedido con un \"BUENO GENTE\"",
            description: "¡Bueno gente! 🖐🖐👊",
            color: COLOR,
            author: {
              name: BOT,
              icon_url: avatar
            },
            image: {
              url: buenogente[getRandom({max: buenogente.length - 1})]
            }
          }]});
        }
        // comando /ship
        case SHIP.name: {
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
        default:
          return error("Unknown Type", 400);
      }
      
    });
  }
  
});

router.all("*", () => new Response("Not Found.", { status: 404 }));
 
export default {
  async fetch(request, env) {
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
    return router.handle(request, env);
  },
};
