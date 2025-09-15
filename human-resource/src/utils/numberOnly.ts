'use client'

type InputNumberOnlyEvent = React.KeyboardEvent<HTMLInputElement>;

export const inputNumberOnly = (e: InputNumberOnlyEvent): void => {
    // Check if the key is not a number, backspace, delete, or tab
    if (!/[\d]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
      e.preventDefault(); // Prevent non-numeric input
    }
}