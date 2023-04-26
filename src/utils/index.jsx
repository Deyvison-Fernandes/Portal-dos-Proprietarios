export const formatDate = (date) => {
  const dateFull = new Date(date);
  const d = dateFull.getDate();
  const m = dateFull.getMonth() + 1;
  const y = dateFull.getFullYear();
  return `${d}/${m}/${y}`;
};

export const formatNasc = (date) => {
  const value =
    date.slice(0, 2) + '/' + date.slice(2, 4) + '/' + date.slice(4, 8);
  return value;
};
