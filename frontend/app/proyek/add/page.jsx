"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import StatusSelect from "@/component/statusSelect";
import Swal from "sweetalert2";

const today = new Date().toISOString().split("T")[0];

export default function ProyekAdd() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
    };

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menambahkan permintaan lapangan");
      }

      Swal.fire({
        icon: "success",
        title: "Permintaan berhasil ditambahkan!",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: error.message || "Gagal mengirim permintaan.",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <div className="flex-1 h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Data Proyek</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 shadow-md rounded-lg w-full max-w-none"
      >
        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Nama Proyek</label>
          <div className="w-full">
            <input
              type="text"
              {...register("name", {
                required: "Nama proyek wajib diisi",
              })}
              placeholder="Judul proyek"
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Kode</label>
          <div className="w-full">
            <input
              type="text"
              {...register("code", {
                required: "Kode Proyek wajib diisi",
              })}
              placeholder="Code untuk proyek"
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Lokasi</label>
          <div className="w-full">
            <input
              type="text"
              {...register("location", {
                required: "Lokasi wajib diisi",
              })}
              placeholder="Lokasi kota"
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Owner</label>
          <input
            type="text"
            {...register("owner")}
            className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
          />
          {errors.owner && (
            <p className="text-red-500 text-sm">{errors.owner.message}</p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Contract No</label>
          <div className="w-full">
            <input
              type="text"
              {...register("contractNo", {
                required: "Nomor kontrak wajib diisi.",
              })}
              placeholder="Nomor Kontrak"
              className="w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-blue-500"
            />
            {errors.contractNo && (
              <p className="text-red-500 text-sm">
                {errors.contractNo.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Start Date</label>
          <div className="w-full">
            <input
              type="date"
              {...register("startDate", {
                required: "Tanggal mulai kerja wajib diisi.",
              })}
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">End Date</label>
          <div className="w-full">
            <input
              type="date"
              {...register("endDate", {
                required: "Tanggal selesai wajib diisi.",
              })}
              defaultValue={today}
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Project Manager</label>
          <div className="w-full">
            <input
              type="text"
              {...register("projectManager", {
                required: "Nama project manager wajib diisi.",
              })}
              className="w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
            {errors.projectManager && (
              <p className="text-red-500 text-sm">
                {errors.projectManager.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <label className="block font-medium w-56">Status</label>
          <div className="w-full">
            <Controller
              name="status"
              control={control}
              defaultValue="PENDING"
              rules={{ required: "Status wajib dipilih" }}
              render={({ field }) => (
                <StatusSelect
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-800"
        >
          Simpan Proyek
        </button>
      </form>
    </div>
  );
}
