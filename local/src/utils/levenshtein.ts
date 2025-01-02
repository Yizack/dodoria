import levenshtein from "fast-levenshtein";

export const findMostSimilar = (input: string, array: string[]): string => {
  let minDistance = Infinity;
  let mostSimilar = array[0]!;

  for (const str of array) {
    const distance = levenshtein.get(input, str);
    if (distance < minDistance) {
      minDistance = distance;
      mostSimilar = str;
    }
  }

  return mostSimilar;
};
