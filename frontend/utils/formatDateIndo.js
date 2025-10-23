const bulanIndo = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const formatDateIndo = (dateString) => {
  if (!dateString) return "-";
  const dateObj = new Date(dateString);

  if (isNaN(dateObj)) return dateString;

  return `${dateObj.getDate()} ${
    bulanIndo[dateObj.getMonth()]
  } ${dateObj.getFullYear()}`;
};
