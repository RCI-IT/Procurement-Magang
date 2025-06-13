import { fetchWithAuth } from "@/services/apiClient";

export const checkDuplicate = async (table, values) => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/${table}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) throw new Error("Gagal mengambil data");
    const data = await res.json();
    
    const result = {};
    for (const field in values) {
      const value = values[field];
      result[field] = data.some((item) => {
        const itemValue = item[field];
        return (
          typeof itemValue === "string" &&
          itemValue.toLowerCase().trim() === value.toLowerCase().trim()
        );
      });
    }

    return result;
  } catch (error) {
    console.error("Error saat cek duplikat:", error);
    return false;
  }
};
