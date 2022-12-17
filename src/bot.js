/**
 * Cloudflare worker.
 */
import { Router } from "itty-router";
import { verifyKey } from "discord-interactions";
import interaction from "./interaction.js";
import { getValue, getRandom } from "./functions.js";
import { ME_MIDE, ME_CABE, CHEER, EDUCAR, COMANDOS } from "./commands.js";
import { angarSad, angarMonkas, angarGasm, angarL } from "./emojis.js";
import { avatar, guide, yizack } from "./images.js";
import { emojiURL } from "./emojisUrls.js";

const router = Router();
const color = 0xf697c8;
const channel = "1053711825650335764";
const channel_pruebas = "1048659746137317498";

router.get("/", (req, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});
 
router.post("/", async (req, env) => {
  const { type, data, member, guild_id, channel_id } = await req.json();
  const { create, reply, error } = interaction;

  if (channel_id === channel || channel_id === channel_pruebas) {
    return create(type, async () => {
      const { name, options } = data;

      switch (name) {
        // Comando /memide
        case ME_MIDE.name: {
          const cm = getRandom(32);
          const emoji = cm >= 15 ? angarMonkas : angarSad;
          return reply(`A <@${member.user.id}> le mide **${cm}** centímetros. ${emoji}`);
        }
        // Comando /mecabe
        case ME_CABE.name: {
          const cm = getRandom(43);
          const emoji = cm >= 10 ? angarGasm : angarL;
          return reply(`A <@${member.user.id}> le caben **${cm}** centímetros. ${emoji}`);
        }
        // Comando /cheer
        case CHEER.name: {
          const mensaje = getValue("mensaje", options);
          if (mensaje.length <= 500) {
            const response = await fetch("https://ttsmp3.com/makemp3_new.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: `msg=${mensaje}&lang=Miguel&source=ttsmp3`
            });
            const body = await response.json();
            return reply(`<@${member.user.id}> abre el enlace para escuchar.`, {embeds : [{
              title: "🔊 Escuchar",
              url: body.URL,
              description: `\`${mensaje}\`\n\n*${body.MP3}*`,
              color: color,
              author: {
                name: `${member.user.username}#${member.user.discriminator}`,
                icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
              },
              thumbnail: {
                url: emojiURL.angarG2
              },
              footer: {
                text: `Voz: Miguel. Caracteres: ${mensaje.length} de 500.`,
                icon_url: [emojiURL.Cheer100, emojiURL.Cheer1k, emojiURL.Cheer5k, emojiURL.Cheer10k, emojiURL.Cheer25k, emojiURL.Cheer50k][getRandom(5)]
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

          const percent = getRandom(100);
          if (percent < 33) {
            const key = guild_id + "-" + usuario;

            let counter = Number(await env.EDUCAR.get(key));
            counter = counter ? counter + 1 : 1;
            await env.EDUCAR.put(key, counter);

            const veces = counter === 1 ? "vez" : "veces";

            message = `<@${usuario}> te educaron.`;
            embeds.push({
              description: `**${member.user.username}** ha educado a **<@${usuario}>**.\n*<@${usuario}> ha sido educado **${counter}** ${veces} en total.*`,
              color: color
            });
          }
          return reply(message, { embeds: embeds });
        }
        case COMANDOS.name: {
          return reply(null, { embeds: [{
            title: "Lista de comandos",
            description: `Conoce la lista de comandos disponibles.\n\n-  \`/${CHEER.name}\` *${CHEER.description}*\n\n-  \`/${ME_MIDE.name}\` *${ME_MIDE.description}*\n\n- \`/${ME_CABE.name}\` *${ME_CABE.description}*\n\n- \`/${EDUCAR.name}\` *${EDUCAR.description}*\n\n\nEscribe el comando que desees en la caja de enviar mensajes de discord y selecciona la opción que se muestra junto al avatar del bot. Se irán añadiendo más comandos divertidos con el tiempo.`,
            color: color,
            author: {
              name: "Dodoria",
              icon_url: avatar
            },
            image: {
              url: guide
            },
            footer: {
              text: "Creado por Yizack.",
              icon_url: yizack
            }
          }]});
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
