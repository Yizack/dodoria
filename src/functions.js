/**
 * General functions
 */
import { CONSTANTS } from "./constants.js";

export const getValue = (name, options) => {
  const option = options.find((option) => option.name === name);
  return option?.value ?? null;
};

export const getRandom = (options) => {
  const min = options.min ?? 1;
  return Math.round((Math.random() * (options.max - min)) + min);
};

export const getRandomAngar = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.ANGAR });
  return `https://dodoria.yizack.com/images/angar_${number}.jpg`;
};

export const getRandomBuenoGente = () => {
  const number = getRandom({ min: 1, max: CONSTANTS.BUENOGENTE });
  return `https://dodoria.yizack.com/images/buenogente_${number}.jpg`;
};

export const esUrl = (cadena) => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?:\/\S*)?$/;
  return regex.test(cadena);
};

export const imbedUrlsFromString = (str) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return str.replace(regex, "<$1>");
};

export const obtenerIDDesdeURL = (url) => {
  const expresionRegular = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const resultado = expresionRegular.exec(url);
  if (resultado && resultado.length > 1) {
    return resultado[1];
  }
  else {
    return null;
  }
};

export const errorEmbed = (error_msg) => {
  const embeds = [];
  embeds.push({
    color: CONSTANTS.COLOR,
    description: error_msg,
  });
  return embeds;
};

export const getRandomAngarMessage = () => {
  const messages = [
    "Te presento el ANGAR que te representa en este momento.",
    "Hoy estás en este mood, y el ANGAR lo refleja perfectamente.",
    "Este es el ANGAR que captura tu esencia hoy.",
    "El ANGAR de hoy refleja tu estado de ánimo actual.",
    "Descubre el ANGAR que encaja con tu vibra de hoy.",
    "Este ANGAR coincide con tu energía en este día.",
    "El ANGAR de hoy está en sintonía con tu estado de ánimo.",
    "Hoy te presento el ANGAR que mejor representa tu vibe.",
    "Este ANGAR en particular se alinea con tu estado de ánimo actual.",
    "¡Descubre el ANGAR que te acompaña en este momento!",
    "¿Listo para conocer el ANGAR interior que ni siquiera sabías que existía?",
    "Prepárate para descubrir el ANGAR que hace temblar a los demás, o al menos eso esperamos.",
    "¡Hoy te presento el ANGAR que ni tú mismo puedes creer que tienes!",
    "Este es el ANGAR que se ríe en la cara de la modestia, ¡disfrútalo!",
    "El ANGAR de hoy podría asustar a tus amigos, ¡así que úsalo con precaución!",
    "Descubre el ANGAR que hace que hasta los trolls se sientan inseguros.",
    "Este ANGAR es tan grande que ni siquiera cabe en esta frase.",
    "El ANGAR de hoy es como un tornado de autoestima, ¡cuidado con no volar lejos!",
    "Hoy te presento el ANGAR que hará que todos los narcisistas se sientan humildes.",
    "¡Este ANGAR es tan grande que debería tener su propio programa de televisión!",
    "¿Estás listo para conocer el ANGAR que hace que los espejos se sientan inútiles?",
    "Este es el ANGAR que podría hacer llorar a Kanye de envidia.",
    "El ANGAR de hoy podría causar estragos en la autoestima de cualquiera, ¡incluido tú!",
    "Descubre el ANGAR que incluso a Shakespeare le costaría describir con palabras.",
    "Hoy te presento el ANGAR que hace que los egos de Hollywood se encojan de envidia.",
    "Este ANGAR es tan grande que su sombra eclipsa hasta al sol.",
    "¡Este ANGAR es tan épico que merece un monumento!",
    "El ANGAR de hoy es como un tsunami de confianza, ¡prepárate para ser arrastrado por él!",
    "¿Estás listo para conocer el ANGAR que podría hacer que los peacocks se sientan modestos?",
    "Este es el ANGAR que podría hacer que los leones se sientan como gatitos en comparación.",
    "El ANGAR de hoy es tan brillante que podría iluminar hasta la noche más oscura.",
    "Descubre el ANGAR que hace que hasta los supervillanos se sientan tímidos.",
    "Hoy te presento el ANGAR que hace que hasta los pavos reales se sientan modestos.",
    "Este ANGAR es tan inflado que hasta los globos sienten envidia.",
    "¡Este ANGAR es tan magnífico que merece su propio día festivo!",
    "El ANGAR de hoy es como una montaña rusa de autoestima, ¡prepárate para los altibajos!",
    "¿Listo para conocer el ANGAR que hace que los espejos se replanteen su carrera?",
    "Este es el ANGAR que podría hacer que los dioses griegos se sientan inseguros.",
    "El ANGAR de hoy es tan grande que debería tener su propia gravedad.",
    "Descubre el ANGAR que hace que hasta los ángeles se sientan un poco vanidosos.",
    "Hoy te presento el ANGAR que hace que los presidentes se sientan modestos.",
    "Este ANGAR es tan monumental que debería estar en los libros de historia.",
    "¡Este ANGAR es tan legendario que merece su propia saga!",
    "El ANGAR de hoy es como un volcán de confianza, ¡prepara las gafas de sol!",
    "¿Listo para conocer el ANGAR que hace que los narcisistas parezcan humildes?",
    "Este es el ANGAR que podría hacer que los gigantes se sientan pequeños.",
    "El ANGAR de hoy es tan deslumbrante que podría cegar a un unicornio.",
    "Descubre el ANGAR que hace que hasta los superhéroes se sientan un poco inseguros.",
    "Hoy te presento el ANGAR que hace que las estrellas de cine se sientan modestas.",
    "Este ANGAR es tan influyente que debería tener su propio ejército de seguidores.",
    "¡Este ANGAR es tan impresionante que merece su propio emoji!",
    "El ANGAR de hoy es como un fuego artificial de autoestima, ¡prepara los ojos!",
    "¿Listo para conocer el ANGAR que hace que los pavos reales se sientan tímidos?",
    "Este es el ANGAR que podría hacer que las estatuas de la libertad se sientan reprimidas.",
    "El ANGAR de hoy es tan alto que podría tocar las nubes.",
    "Hoy te presento el ANGAR que hace que los millonarios se sientan humildes.",
    "Este ANGAR es tan monumental que incluso las pirámides se sienten pequeñas a su lado.",
    "¡Este ANGAR es tan épico que merece ser esculpido en una montaña!"
  ];
  return messages[getRandom({ min: 0, max: messages.length - 1 })];
};
