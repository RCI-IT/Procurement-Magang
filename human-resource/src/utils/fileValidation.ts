// fileValidation.ts

interface FileValidationRules {
  maxSize?: number; // Maximum size in bytes
  allowedTypes?: string[]; // Allowed MIME types (optional)
}

export const validations: FileValidationRules = {
    maxSize: 2 * 1024 * 1024, // 2MB max size
    allowedTypes: ["image/jpeg", "image/png"], // Only allow JPEG and PNG files
  };

export const validateFile = (
  file: File,
  validations: FileValidationRules
): string | null => {
  // Check if file exceeds the maximum size
  if (validations.maxSize && file.size > validations.maxSize) {
    return `File size should be less than ${
      validations.maxSize / (1024 * 1024)
    }MB`;
  }

  // Check if file type is allowed (optional)
  if (
    validations.allowedTypes &&
    !validations.allowedTypes.includes(file.type)
  ) {
    return `File type should be one of: ${validations.allowedTypes.join(", ")}`;
  }

  return null; // Return null if no validation errors
};
