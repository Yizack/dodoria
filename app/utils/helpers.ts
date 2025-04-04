export const open = (link: string) => window.open(link, "_blank");

export const formatWatchtime = (minutes: number) => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  return `${days}d ${hours}h ${mins}min`;
};
