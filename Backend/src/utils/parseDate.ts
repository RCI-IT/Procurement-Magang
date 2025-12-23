export function parseDateOnly(value: string): Date | undefined {
  if (!value) return undefined;

  // support "YYYY-MM-DD" atau "DD-MM-YYYY"
  let year: number, month: number, day: number;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // YYYY-MM-DD
    [year, month, day] = value.split("-").map(Number);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    // DD-MM-YYYY
    [day, month, year] = value.split("-").map(Number);
  } else {
    throw new Error("Invalid date format, expected YYYY-MM-DD or DD-MM-YYYY");
  }

  // ⛔ jangan pakai local time
  // ✅ pakai UTC secara eksplisit
  return new Date(Date.UTC(year, month - 1, day));
}
