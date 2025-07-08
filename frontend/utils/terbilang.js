"use client";

export const terbilang = (angka) => {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
  ];
  const belasan = [
    "Sepuluh",
    "Sebelas",
    "Dua Belas",
    "Tiga Belas",
    "Empat Belas",
    "Lima Belas",
    "Enam Belas",
    "Tujuh Belas",
    "Delapan Belas",
    "Sembilan Belas",
  ];
  const puluhan = [
    "",
    "",
    "Dua Puluh",
    "Tiga Puluh",
    "Empat Puluh",
    "Lima Puluh",
    "Enam Puluh",
    "Tujuh Puluh",
    "Delapan Puluh",
    "Sembilan Puluh",
  ];
  const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];

  if (angka === 0) return "Nol Rupiah";

  const konversi = (num) => {
    if (num < 10) return satuan[num];
    if (num < 20) return belasan[num - 10];
    if (num < 100)
      return puluhan[Math.floor(num / 10)] + " " + satuan[num % 10];
    if (num < 1000)
      return satuan[Math.floor(num / 100)] + " Ratus " + konversi(num % 100);
    return "";
  };

  let hasil = "";
  let i = 0;

  while (angka > 0) {
    let bagian = angka % 1000;
    if (bagian > 0) {
      hasil = konversi(bagian) + " " + ribuan[i] + " " + hasil;
    }
    angka = Math.floor(angka / 1000);
    i++;
  }

  return hasil.trim() + " Rupiah";
}
