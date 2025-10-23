"use client";

import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/services/apiClient";
import { formatDateIndo } from "@/utils/formatDateIndo";
import { useForm, Controller } from "react-hook-form";
import StatusSelect from "@/component/statusSelect";
import Swal from "sweetalert2";

export default function DetailProyek() {
  const { id } = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    fetchWithAuth
  );

  if (error) return <p>Data gagal diambil.</p>;
  if (isLoading) return <p>Loading...</p>;

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const onSubmit = async (formData) => {
    const finalData = Object.keys(formData).reduce((acc, key) => {
      const oldValue = data[key];
      const newValue = formData[key];

      // Cek jika field adalah tanggal (bisa deteksi berdasarkan key name)
      if (key.includes("Date")) {
        // Normalisasi keduanya ke format YYYY-MM-DD
        const oldDate = oldValue
          ? new Date(oldValue).toISOString().split("T")[0]
          : "";
        const newDate = newValue
          ? new Date(newValue).toISOString().split("T")[0]
          : "";

        if (oldDate !== newDate) {
          acc[key] = newValue; // kirim string "2025-01-08"
        }
      } else if (newValue !== oldValue) {
        // Field biasa (non-date)
        acc[key] = newValue;
      }

      return acc;
    }, {});

    if (Object.keys(finalData).length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada perubahan",
        confirmButtonText: "Ok",
      });
      return;
    }

    console.log(data);
    console.log("Data yang dikirim:", finalData);

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (!response) {
        throw new Error("Gagal menyimpan proyek");
      }

      await mutate(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`);
      Swal.fire({
        icon: "success",
        title: "Proyek berhasil disimpan!",
        confirmButtonText: "Ok",
      });
      router.push(`/proyek`);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: error.message || "Gagal menyimpan proyek.",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data yang dihapus tidak dapat dikembalikan. (ID: ${id})`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (!result.isConfirmed) return;

      if (result.isConfirmed) {
        const deleted = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
          {
            method: "DELETE",
          }
        );
        if (deleted?.message?.includes("budget")) {
          await Swal.fire("Gagal!", deleted.message, "error");
        }
        await mutate(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: error.message || "Gagal menghapus data.",
      });
    }
  };

  return (
    <div className="flex">
      <div className="p-6 flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 bg-white shadow-md p-4 rounded-md space-y-4"
        >
          {isAdmin ? (
            <Controller
              name="name"
              control={control}
              defaultValue={data.name}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <h2 className="text-3xl font-bold">{data.name}</h2>
          )}

          {isAdmin ? (
            <div className="flex gap-2">
              <input
                type="date"
                {...register("startDate")}
                defaultValue={
                  new Date(data.startDate).toISOString().split("T")[0]
                }
                className="border p-2 rounded"
              />
              <span className="self-center">s/d</span>
              <Controller
                name="endDate"
                control={control}
                defaultValue={
                  new Date(data.endDate).toISOString().split("T")[0]
                }
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    onChange={(e) => {
                      const tanggal = e.target.value;
                      field.onChange(tanggal);
                    }}
                    className="border p-2 rounded"
                  />
                )}
              />
            </div>
          ) : (
            <p>
              {formatDateIndo(data.startDate)} s/d{" "}
              {formatDateIndo(data.endDate)}
            </p>
          )}

          {isAdmin ? (
            <Controller
              name="code"
              control={control}
              defaultValue={data.code}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <p className="text-gray-600 text-sm">Kode : {data.code}</p>
          )}

          {isAdmin ? (
            <Controller
              name="location"
              control={control}
              defaultValue={data.location}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <p className="text-gray-600 text-sm">Lokasi : {data.location}</p>
          )}

          {isAdmin ? (
            <Controller
              name="status"
              control={control}
              defaultValue={data.status}
              rules={{ required: "Status wajib dipilih" }}
              render={({ field }) => (
                <StatusSelect
                  {...field}
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <p className="text-gray-600 text-sm">Status : {data.status}</p>
          )}

          {isAdmin ? (
            <Controller
              name="owner"
              control={control}
              defaultValue={data.owner}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <p className="text-gray-600 text-sm">Owner : {data.owner}</p>
          )}

          {isAdmin ? (
            <Controller
              name="contractNo"
              defaultValue={data.contractNo}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="border p-2 rounded w-full"
                />
              )}
            />
          ) : (
            <p className="text-gray-600 text-sm">
              Contract No : {data.contractNo}
            </p>
          )}

          {isAdmin && (
            <>
              <button
                type="submit"
                className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-800"
              >
                Simpan Proyek
              </button>
              <button
                type="button"
                onClick={() => handleDelete(id)}
                className="bg-red-500 text-white rounded px-6 py-2 ml-2 hover:bg-red-800"
              >
                Hapus
              </button>
            </>
          )}
        </form>

        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <h2 className="text-2xl font-bold">Tim Proyek</h2>
          <ul className="list-disc ml-6">
            <li>user.name — roleInProject</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
