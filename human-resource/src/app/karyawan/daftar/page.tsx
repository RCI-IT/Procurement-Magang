"use client";

import Breadcrumb from "@/components/breadcrumb";
import CardHead from "@/components/card-head";
import Table from "@/components/tabel";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { BiSolidUserMinus } from "react-icons/bi";
import { FaUserClock, FaUserPlus } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { TbEye } from "react-icons/tb";
import { Employee } from "@/types/employeeTypes";
import { LoadingPage } from "@/handler/loading";
import IsNotFound from "@/handler/isNotFound";
import { useKaryawanData } from "@/services/apiKaryawan";
import DeleteButton from "@/components/deleteButton";

const apiURL = process.env.NEXT_PUBLIC_API_BACKEND;

export default function EmployeeList() {
  const { data, error, isLoading, isNotFound } = useKaryawanData();

  if (isLoading) return <LoadingPage />;
  if (error) return <IsNotFound />;
  const isError = isNotFound || "message" in data;

  const safeData = Array.isArray(data) ? data : [];

  const recentData = safeData.filter((item: Employee) => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const createdDate = new Date(item.hireDate);
    return createdDate >= oneMonthAgo && createdDate <= today;
  });

  const columns: ColumnDef<Employee>[] = [
    {
      id: "image",
      header: "Foto",
      accessorKey: "image",
      cell: (ctx) => {
        return (
          <div className="w-32 h-32 relative overflow-hidden mx-auto">
            {/* Only render the Image component if ctx.getValue() is a valid string */}
            {typeof ctx.getValue() === "string" && ctx.getValue() !== "" ? (
              <Image
                src={`${apiURL}/images/${ctx.getValue()}`}
                alt={
                  typeof ctx.row.original.image === "string"
                    ? ctx.row.original.image
                    : "Profile Image"
                }
                width={500}
                height={500}
                className="w-full h-full rounded-lg object-cover object-center"
              />
            ) : (
              <p>No valid image available</p> // Fallback text in case there's no valid image
            )}
          </div>
        );
      },
    },
    {
      header: "Nama Lengkap",
      accessorKey: "fullName",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Id Karyawan",
      accessorKey: "employeeNumber",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Posisi",
      accessorKey: "position",
      cell: (ctx) => ctx.getValue(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (ctx) => ctx.getValue(),
    },
    {
      id: "email",
      header: "Email Address",
      cell: (ctx: { row: { original: { email: string } } }) => {
        const { email } = ctx.row.original;
        return <span className="font-bold">{email}</span>;
      },
    },
    {
      id: "Aksi",
      header: "Aksi",
      accessorKey: "id",
      cell: (ctx) => {
        const idKaryawan = ctx.row.original.id; // Mengakses data asli dari baris
        if (!idKaryawan) return null; // Menghindari jika idKaryawan tidak ada
        return (
          <div className="flex justify-center place-items-center space-x-5">
            <Link href={`/karyawan/${idKaryawan}`}>
              <TbEye className={`text-2xl text-blue-600`} />
            </Link>
            <DeleteButton
              url={`/employees/${idKaryawan}`}
              confirmMessage={`Yakin ingin menghapus ${ctx.row.original.fullName}?`}
              onDeleted={() => console.log("Berhasil dihapus")}
            >
              Hapus Karyawan
            </DeleteButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <nav>
        <p className="text-3xl font-semibold text-[#282828]">
          Manajemen Karyawan
        </p>
        <Breadcrumb />
      </nav>
      <div className="flex items-center justify-between w-full py-5 space-x-6">
        <CardHead
          Icon={HiUsers}
          title={""}
          jumlah={isError ? 0 : data.length}
          perubahan={"Total Karyawan"}
          itemClass={"items-center"}
          logoClass={"bg-blue-200 text-blue-900 text-4xl p-2"}
        />
        <CardHead
          Icon={FaUserPlus}
          title={""}
          jumlah={recentData.length}
          perubahan={"Karyawan Baru"}
          itemClass={"items-center"}
          logoClass={"bg-green-200 text-green-900 text-4xl p-2"}
        />
        <CardHead
          Icon={BiSolidUserMinus}
          title={""}
          jumlah={safeData.filter((item) => item.status === "RESIGN").length}
          perubahan={"Karyawan Berhenti"}
          itemClass={"items-center"}
          logoClass={"bg-red-200 text-red-900 text-4xl p-2"}
        />
        <CardHead
          Icon={FaUserClock}
          title={""}
          jumlah={safeData.filter((item) => item.status === "ONLEAVE").length}
          perubahan={"Karyawan Cuti"}
          itemClass={"items-center"}
          logoClass={"bg-yellow-200 text-yellow-900 text-4xl p-2"}
        />
      </div>
      <Table
        objectData={isError ? [] : data}
        columns={columns}
        judul={`Daftar Karyawan`}
        tambahLink={"/karyawan/tambah"}
      />
    </div>
  );
}
