"use client";
import Breadcrumb from "@/components/breadcrumb";
import { LoadingOffPage, LoadingPage } from "@/handler/loading";
import { useKaryawanDataDetail } from "@/services/apiKaryawan";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import IsNotFound from "./notFound";
import DocumentCard from "./documentCard";
import { TbEdit } from "react-icons/tb";
import { useState } from "react";

const apiURL = process.env.NEXT_PUBLIC_API_BACKEND;
export default function DetailKaryawan() {
  const params = useParams(); // Retrieve the dynamic parameters
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();

  const { idKaryawan } = params; // Access the 'id' parameter from the URL

  const validId = idKaryawan && !Array.isArray(idKaryawan) ? idKaryawan : "";
  const { data, error, isLoading, isNotFound } = useKaryawanDataDetail(validId);

  // If idKaryawan is invalid (null, undefined, or an array), render an error
  if (!idKaryawan || Array.isArray(idKaryawan)) {
    return <div>Error: Invalid ID provided in the URL query string.</div>;
  }

  const handleEditClick = async () => {
    setIsLoadingPage(true);
    await router.push(`/karyawan/${idKaryawan}/edit`);
  };

  // Handle loading state
  if (isLoading) return <LoadingPage />;

  if (error) return <div>Error: {error.message}</div>;

  // Periksa apakah id tidak ada
  if (isNotFound) return <IsNotFound />;

  // Conditional check to ensure `data` is available before rendering.

  if ((!data && !isLoading) || data === null) {
    console.log("Data is missing:", data); // Check if data is undefined
    return <div>No employee data found</div>;
  }

  // Check if `data` is an ErrorResponse by checking if it has a `message` property
  if ("message" in data) {
    // If data has a message, it is an ErrorResponse
    return <div>Error: {data.message}</div>;
  }

  return (
    <div className="w-full space-y-5">
      {isLoadingPage && <LoadingOffPage />}
      <nav>
        <p className="text-3xl font-semibold text-[#282828]">Detail Karyawan</p>
        <Breadcrumb />
      </nav>

      <div className="w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
        <div className="w-full h-auto flex justify-between items-center py-4 px-4">
          <h3 className="text-xl font-semibold space-y-4">Profil Karyawan</h3>
          <button
            onClick={handleEditClick}
            className="flex space-x-2 hover:text-blue-600 group"
          >
            <TbEdit
              className={`text-2xl text-blue-600 
               transition duration-200 transform ease-in-out group-hover:scale-105 group-active:scale-75`}
            />
            <p className="text-blue-600">Edit</p>
          </button>
        </div>

        {/* Garis Pembatas */}
        <div className="w-auto border-t-2 border-gray-300"></div>

        <div className="w-full flex justify-evenly py-4 px-4 space-y-4">
          <div className="flex-1 flex justify-start">
            <div className="w-40 h-40 relative">
              <Image
                src={`${apiURL}/images/${data.image}`}
                alt="Photo Profile"
                width={500}
                height={500}
                className="w-full h-full rounded-lg object-cover object-center"
              />
            </div>
            <div className="w-full px-4">
              <div className="pb-4">
                <p className="font-medium text-lg">{data.fullName}</p>
                <p className="font-thin text-gray-600 text-sm">IT Staff</p>
              </div>
              <div className="flex w-full space-x-6">
                <div>
                  <p>ID Karyawan</p>
                  <p>Jenis Kelamin</p>
                  <p>Alamat</p>
                </div>
                <div className="font-light text-gray-500">
                  <p>{data.employeeNumber}</p>
                  <p>{data.gender}</p>
                  <p>{data.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Garis Putus-Putus Pembatas */}
          <div className="border-l-2 border-dashed border-gray-500 h-auto"></div>

          <div className="flex-1 px-4 h-auto flex items-center space-x-6">
            <div>
              <p>Tempat Lahir</p>
              <p>Tanggal Lahir</p>
              <p>Agama</p>
              <p>Email</p>
              <p>No. Telp</p>
            </div>
            <div className="font-light text-gray-500">
              <p>{data.birth}</p>
              <p>{data.birthDate.slice(0, 10)}</p>
              <p>{data.religion}</p>
              <p>{data.email}</p>
              <p>
                <a
                  href={`https://wa.me/${data.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-green-500 hover:bg-blue-100 hover:scale-105 
                  transition-all duration-300 ease-in-out py-1 rounded-md"
                >
                  {data.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
        <h3 className="text-xl font-semibold py-4 px-4 space-y-4">
          Pendidikan Terakhir
        </h3>

        {/* Garis Pembatas */}
        <div className="w-auto border-t-2 border-gray-300"></div>

        <div className="w-full flex space-x-3 py-4 px-4">
          <div className="border-2 border-blue-700 w-5 h-5 rounded-full"></div>
          <div>
            <p>{data.education}</p>
            <p className="font-light text-gray-500 text-sm">{data.major}</p>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
        <h3 className="text-xl font-semibold py-4 px-4">
          Jabatan (
          {data.status === "ACTIVE" ? (
            <span className="text-primaryColor">AKTIF</span>
          ) : data.status === "ONLEAVE" ? (
            <span className="text-yellow-600">CUTI</span>
          ) : (
            <span className="text-errorFormColor">BERHENTI</span>
          )}
          )
        </h3>

        {/* Garis Pembatas */}
        <div className="w-auto border-t-2 border-gray-300"></div>

        <div className="w-full flex space-x-3 py-4 px-4">
          <div className="border-2 border-blue-700 w-5 h-5 rounded-full"></div>
          <div>
            <p>{data.position}</p>
            <p className="font-light text-gray-500 text-sm">{data.status}</p>
            <p className="font-light text-gray-500 text-sm">
              {data.hireDate.slice(0, 10)}{" "}
              {data.status === "RESIGN"
                ? `s/d ${data.resignDate.slice(0, 10)}`
                : ""}
            </p>
            {data.status !== "ONLEAVE" ? <></> : <p>Cuti : {data.leaveDate}</p>}
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
        <h3 className="text-xl font-semibold py-4 px-4">Berkas</h3>

        {/* Garis Pembatas */}
        <div className="w-auto border-t-2 border-gray-300"></div>

        <div className="w-full flex justify-evenly py-4 px-4">
          {/* KTP */}
          <DocumentCard
            imageSrc={`${apiURL}/ktp/${data.document.idCard}`}
            altText="KTP"
            label="KTP"
          />

          {/* Garis Putus-Putus Pembatas */}
          <div className="border-l-2 border-dashed border-gray-500 h-auto"></div>

          {/* Kartu Keluarga */}
          <DocumentCard
            imageSrc={`${apiURL}/kartukeluarga/${data.document.familyCard}`}
            altText="Kartu Keluarga"
            label="Kartu Keluarga"
          />

          {/* Garis Putus-Putus Pembatas */}
          <div className="border-l-2 border-dashed border-gray-500 h-auto"></div>

          {data.document.taxCard ? (
            <>
              {/* NPWP */}
              <DocumentCard
                imageSrc={`${apiURL}/npwp/${data.document.taxCard}`}
                altText="NPWP"
                label="NPWP"
              />

              {/* Garis Putus-Putus Pembatas */}
              <div className="border-l-2 border-dashed border-gray-500 h-auto"></div>
            </>
          ) : null}

          {/* Ijazah Terakhir */}
          <DocumentCard
            imageSrc={`${apiURL}/ijazah/${data.document.diploma}`}
            altText="Ijazah Terakhir"
            label="Ijazah Terakhir"
          />
        </div>
      </div>
    </div>
  );
}
