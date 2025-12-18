export function formatDateFields<T extends Record<string, any>>(
  data: T
): Record<string, any> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (
      typeof value === "string" &&
      key.toLowerCase().includes("date") &&
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      acc[key] = new Date(value);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {} as Record<string, any>);
}
