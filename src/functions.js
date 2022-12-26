/**
 * General functions
 */
export const getValue = (name, options) => {
  const option = options.find((option) => option.name === name);
  return option?.value ?? null;
};

export const getRandom = (min = 1, max) => {
  return Math.round((Math.random() * (max - min)) + min);
};
