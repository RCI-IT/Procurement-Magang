"use client";
"use client";

import useSWR, { mutate } from "swr";
import { Employee } from "@/types/employeeTypes";
import { getWithExpiry, setWithExpiry } from "./localStorage";
import { useEffect, useState } from "react";

// Interface untuk struktur error response
interface ErrorResponse {
  message: string;
}
const apiURL = process.env.NEXT_PUBLIC_API_BACKEND;
const STORAGE_KEY = "employees";
const TTL = 3600000;

// Fungsi fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Digunakan jika mengambil data dengan token yang didapat dari auth

// const fetcherWithToken = async <T>(url: string): Promise<T> => {
//   const token = getTokenWithExpiry();
//   if (!token) throw new Error('Unauthorized');

//   const res = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     const errorBody = await res.json();
//     const error = new Error(errorBody.message || 'Error') as Error & { status?: number };
//     error.status = res.status;
//     throw error;
//   }

//   return res.json();
// };

// Custom hook untuk mengambil data karyawan
export const useKaryawanData = () => {
  const [fallback, setFallback] = useState<Employee[] | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const cached = getWithExpiry(STORAGE_KEY);
    if (cached) {
      setFallback(cached);
    }
    setInitialLoad(true);
  }, []);

  const { data, error, mutate } = useSWR<Employee[] | ErrorResponse>(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/employees`,
    fetcher,
    {
      fallbackData: initialLoad ? fallback || undefined : undefined,
      revalidateOnMount: true,
    }
  );

  const isNotFound =
    data && (data as ErrorResponse).message?.includes("not found");

  useEffect(() => {
    if (data && !("message" in data)) {
      setWithExpiry(STORAGE_KEY, data, TTL);
    }
    setInitialLoad(false);
  }, [data]);

  return {
    data: data || [],
    error,
    isLoading: !data && !error,
    isNotFound,
    refetch: mutate,
  };
};

export const useKaryawanDataDetail = (id: string) => {
  const { data, error } = useSWR<Employee | ErrorResponse>(
    `${apiURL}/api/employees/${id}`,
    fetcher
  );

  const isNotFound =
    data && (data as ErrorResponse).message?.includes("not found"); // Memeriksa pesan error

  return {
    data: data || null,
    error,
    isLoading: !data && !error,
    isNotFound,
  };
};

export const postKaryawanWithFile = async (data: Employee) => {
  // Check if 'data' is already a FormData object
  const formData = data instanceof FormData ? data : new FormData();

  // Iterate over properties of data object
  for (const [key, value] of Object.entries(data)) {
    // Jika nilainya undefined, kita skip agar tidak dikirim
    if (value === undefined || value === "") {
      continue;
    }

    // Jika nilainya null, kita ubah jadi string "null" (opsional, bisa disesuaikan)
    if (value === null) {
      // formData.append(key, "null");
      continue;
    }

    // Check if the key is "price" and the value is a string
    else if (key === "price" && typeof value === "string") {
      // Convert the "price" value to a number and replace non-numeric characters
      const harga = parseFloat(value.replace(/[^0-9]/g, ""));
      // Append the "harga" field to FormData
      formData.append(key, String(harga));
    }
    // Check if the value is a File
    else if (value instanceof File) {
      // Append a timestamp to the original file name to make it unique
      const uniqueFileName = `${key}_${value.name}`;
      formData.append(key, value, uniqueFileName);
    }

    // Jika value adalah nested object (misalnya: document: { idCard, taxCard, ... })
    else if (
      value &&
      typeof value === "object" &&
      value.constructor === Object
    ) {
      // If the value is an object, assume it is a nested object and iterate over its properties
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        // Skip jika nilainya undefined atau null (misalnya taxCard yang kosong)
        // if (nestedValue === undefined || nestedValue === null) {
        //   formData.append(`${nestedKey}`, null)
        // };

        if (nestedValue instanceof File) {
          // const uniqueNestedFileName = `${key}.${nestedKey}_${Date.now()}_${
          //   nestedValue.name
          // }`;
          formData.append(`${nestedKey}`, nestedValue, nestedValue.name);
        } else {
          // If it's not a file, append as a string
          // formData.append(`${nestedKey}`, String(nestedValue));
          continue;
        }
      }
    } else {
      // Ensure to cast value to string before appending
      formData.append(key, String(value));
    }
  }

  console.log("Ini formData:", formData);
  console.log(Object.fromEntries(formData.entries()));

  try {
    const response = await fetch(`${apiURL}/api/employees/`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      //   // Add any additional headers if needed
      // },
      body: formData,
    });

    await mutate(`${apiURL}/api/employees`);
    console.log("Data berhasil ditambah");
    return response.status;
  } catch (error) {
    console.error("Error posting data:", error); // Log the error for debugging
    // throw new Error("Error posting data");
    return {
      success: false,
      status: 0,
      message: "Network error. Please check your connection.",
    };
  }
};

export const editDataWithFile = async (data: Employee, id: string) => {
  const formData = data instanceof FormData ? data : new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    } else if (key === "price" && typeof value === "string") {
      const harga = parseFloat(value.replace(/[^0-9]/g, ""));
      formData.append(key, String(harga));
    } else if (value instanceof File) {
      const uniqueFileName = `${key}_${value.name}`;
      formData.append(key, value, uniqueFileName);
    } else if (
      value &&
      typeof value === "object" &&
      value.constructor === Object
    ) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue === undefined || nestedValue === null) {
          continue;
        } else if (nestedValue instanceof File) {
          formData.append(`${nestedKey}`, nestedValue, nestedValue.name);
        } else {
          formData.append(`${nestedKey}`, String(nestedValue));
        }
      }
    } else {
      formData.append(key, String(value));
    }
  }

  console.log(formData);

  try {
    const response = await fetch(`${apiURL}/api/employees/${id}`, {
      method: "PUT",
      body: formData,
    });
    await mutate(`${apiURL}/api/employees`);
    console.log("Data berhasil diperbaharui");
    return response;
  } catch (error) {
    console.error("Error posting data:", error); // Log the error for debugging
    throw new Error("Error posting data");
  }
};

export const deleteData = async (id: string) => {
  const response = await fetch(`${apiURL}/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await mutate(`${apiURL}/api/employees`);

  if (!response.ok) {
    throw new Error("Gagal menghapus karyawan");
  }
  return response.json();
};
