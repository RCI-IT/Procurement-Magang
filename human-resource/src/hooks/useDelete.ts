import { useState, useEffect } from "react";

type UseDeleteOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  confirmMessage?: string;
  confirm?: boolean;
  reloadOnSuccess?: boolean;
};

export function useDelete(options?: UseDeleteOptions) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDeleting ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDeleting]);

  const handleDelete = async (
    url: string,
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (options?.confirm !== false) {
      const confirmed = window.confirm(
        options?.confirmMessage || "Yakin ingin menghapus data ini?"
      );
      if (!confirmed) return;
    }

    setIsDeleting(true);
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_BACKEND;
      const response = await fetch(`${apiURL}/api${url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      await response.json(); // optional, tergantung respons API

      options?.onSuccess?.();

      if (options?.reloadOnSuccess) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus.");
      options?.onError?.(error);
    } finally {
      // setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
