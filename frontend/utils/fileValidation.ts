// utils/fileValidation.ts
export function handleFileLimit(
  file: File,
  maxSizeMB: number = 2
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (!file) return { valid: false, error: "File tidak ditemukan." };
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`,
    };
  }
  return { valid: true };
}
