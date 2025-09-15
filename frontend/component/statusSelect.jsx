import Select from "react-select";

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "#FACC15" },
  { value: "ACTIVE", label: "Active", color: "#4ADE80" },
  { value: "COMPLETED", label: "Completed", color: "#60A5FA" },
  { value: "CANCELLED", label: "Cancelled", color: "#F87171" },
];

const colourStyles = {
  option: (styles, { data, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused
      ? data.color
      : isSelected
      ? data.color
      : undefined,
    color: isSelected || isFocused ? "#ffffff" : "#1f2937"
  }),
  control: (styles) => ({
    ...styles,
    borderRadius: 4,
    borderColor: "#D1D5DB",
    padding: 2,
  }),
};

export default function StatusSelect({ name, value, onChange }) {
  const selectedOption = statusOptions.find((opt) => opt.value === value);

  const handleSelectChange = (selected) => {
    const syntheticEvent = {
      target: {
        name,
        value: selected?.value || "",
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <Select
      options={statusOptions}
      value={selectedOption}
      onChange={handleSelectChange}
      styles={colourStyles}
      className="w-full"
    />
  );
}
