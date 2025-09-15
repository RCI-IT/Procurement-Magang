"use client";

import Breadcrumb from "@/components/breadcrumb";
import DeleteButton from "@/components/deleteButton";
import Table from "@/components/tabel";
import IsNotFound from "@/handler/isNotFound";
import { LoadingPage } from "@/handler/loading";
import { useCertificate } from "@/services/apiCertificate";
import { Certificate } from "@/types/certificateType";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
// import { MdOutlineDeleteForever } from "react-icons/md";
import { TbEye, TbPencil } from "react-icons/tb";

export default function CertificateList() {
  const { data, error, isLoading, isNotFound } = useCertificate();
  // const { handleDelete, isDeleting } = useDeleteLoad();

  if (isLoading) return <LoadingPage />;
  if (error) return <IsNotFound />;
  const isError = isNotFound || "message" in data;
  const columns: ColumnDef<Certificate>[] = [
    {
      header: "Nama Pemilik",
      accessorKey: "employee.fullName",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Kualifikasi",
      accessorKey: "qualification",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "No. Sertifikat",
      accessorKey: "certificateNo",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "No. Registrasi",
      accessorKey: "registrationNo",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Terbit",
      accessorKey: "issueDate",
      cell: (ctx) => {
        const date = ctx.getValue();
        if (typeof date === "string") return date.slice(0, 10);
      },
    },
    {
      header: "Expired",
      accessorKey: "expireDate",
      cell: (ctx) => {
        const date = ctx.getValue();
        if (typeof date === "string") return date.slice(0, 10);
      },
    },
    {
      header: "Terpakai / Belum",
      accessorKey: "status",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Perusahaan",
      accessorKey: "company",
      cell: (ctx) => ctx.getValue(),
    },
    {
      id: "Aksi",
      header: "Aksi",
      accessorKey: "id",
      cell: (ctx) => {
        const link = ctx.row.original.documentLink; // Mengakses data asli dari baris
        const id = ctx.row.original.id;
        if (!ctx.getValue()) return null; // Menghindari jika idKaryawan tidak ada
        return (
          <div className="flex justify-center place-items-center space-x-5">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <TbEye className={`text-2xl text-blue-600`} />
            </a>
            <Link href={`/certificate/${id}`}>
              <TbPencil className={`text-2xl text-blue-600`} />
            </Link>
            <DeleteButton
              url={`/certification/${id}`}
              confirmMessage={`Yakin ingin menghapus ${ctx.row.original.certificateNo}`}
              onDeleted={() => console.log("Berhasil dihapus")}
            />
            {/* <button onClick={(e) => handleDelete(id, e)}>
                <MdOutlineDeleteForever className={`text-2xl text-red-900`} />
              </button> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-5">
      {/* {isDeleting && <LoadingOffPage/>} */}
      <nav>
        <p className="text-3xl font-semibold text-[#282828]">
          Sertifikat Keahlian Kerja (SKK){" "}
        </p>
        <Breadcrumb />
      </nav>

      <Table
        objectData={isError ? [] : data}
        columns={columns}
        judul={`Daftar Certificate`}
        tambahLink={"/certificate/tambah"}
      />
    </div>
  );
}
