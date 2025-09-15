export const FormatCurrency = (value: number | string): string => {
  return value
    ? `Rp ${new Intl.NumberFormat("id-ID").format(Number(value))}`
    : "";
};

// Function to handle the change event, sanitize the value, and pass it to the form field
export const HandleCurrencyChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: { onChange: (value: number) => void }
): void => {
  const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  const numericValue = rawValue ? Number(rawValue) : 0; // Convert to numeric value
  field.onChange(numericValue); // Update the field value
};
