"use client";
import Breadcrumb from "@/components/breadcrumb";
import { LoadingOffPage, LoadingPage } from "@/handler/loading";
import {
  editDataWithFile,
  useKaryawanData,
  useKaryawanDataDetail,
} from "@/services/apiKaryawan";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Employee } from "@/types/employeeTypes";
import { validateFile, validations } from "@/utils/fileValidation";
import IsNotFound from "../notFound";
import { checkDuplicate } from "@/utils/checkDuplicate";
import { inputNumberOnly } from "@/utils/numberOnly";
import { FormatCurrency, HandleCurrencyChange } from "@/utils/setCurrency";

const apiURL = `${process.env.NEXT_PUBLIC_API_BACKEND}`;

export default function Edit() {
  const params = useParams<{ idKaryawan: string }>();
  const { idKaryawan } = params;

  const steps = ["Informasi Pribadi", "Pendidikan", "Jabatan", "Berkas"];
  const [step, setStep] = useState(0);

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleNext = async () => {
    // Trigger validation for all fields
    const isValid = await trigger();
    if (isValid) {
      // Proceed to the next step
      // Your existing logic for moving to the next step
      setStep((prevStep) => prevStep + 1);
    } else {
      // Display error messages or handle them as needed
      console.log("Validation errors, cannot proceed to the next step");
    }
  };

  const [loadSubmit, setLoadSubmit] = useState(false);

  const { data, error, isLoading, isNotFound } =
    useKaryawanDataDetail(idKaryawan);

  const employeeData = data as Employee;

  const {
    control,
    handleSubmit,
    setError,
    trigger,
    watch,
    formState: { errors },
  } = useForm<Employee>({
    mode: "onChange",
  });

  const status = watch("status");

  const onSubmit = async (data: Employee) => {
    try {
      setLoadSubmit(true);
      // Tampilkan data yang diinput di console
      console.log("Data yang disubmit: ", data);

      await editDataWithFile(data, idKaryawan);
      setTimeout(() => {
        window.location.href = `/karyawan/${idKaryawan}`;
      }, 3000);
    } catch {
      setLoadSubmit(false);
      alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    }
  };

  // Handle file change and validation in one go
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (file: File) => void,
    name: keyof Employee
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validationError = validateFile(file, validations);
      if (validationError) {
        setError(name, {
          type: "manual",
          message: validationError,
        });
      } else {
        fieldOnChange(file); // Only call field.onChange if validation passes
      }
    }
  };

  // Call the hook to fetch employee data
  const {
    data: duplicateData,
    error: duplicateError,
    isLoading: loading,
    isNotFound: notFound,
  } = useKaryawanData();
  const existingEmployeeNumbers = Array.isArray(duplicateData)
    ? duplicateData.map((karyawan) => karyawan.employeeNumber)
    : [];
  const existingIdCardNumber = Array.isArray(duplicateData)
    ? duplicateData.map((karyawan) => karyawan.idCardNumber)
    : [];
  const existingEmail = Array.isArray(duplicateData)
    ? duplicateData.map((karyawan) => karyawan.email)
    : [];
  const existingPhone = Array.isArray(duplicateData)
    ? duplicateData.map((karyawan) => karyawan.phone)
    : [];

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <LoadingPage />;
  if (isNotFound) return <IsNotFound />;
  if (duplicateError) return <div>Error: {error.message}</div>;
  if (loading) return <LoadingPage />;
  if (notFound) return <IsNotFound />;

  return (
    <div className="w-full">
      {loadSubmit && <LoadingOffPage />}
      <nav>
        <p className="text-3xl font-semibold text-[#282828]">Karyawan</p>

        {/* ---------------- Breadcrumb ---------------- */}
        <Breadcrumb />
      </nav>

      <div className="pt-5 space-y-5 relative">
        {/* ---------------- Form Tambah Karyawan ---------------- */}
        From Edit Karyawan
        {/* Island Pembagian 4 Steps */}
        <div className="min-w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white p-6 items-center flex justify-between">
          {steps.map((label, index) => (
            <Fragment key={index}>
              <div
                className={`flex items-center space-x-3 ${
                  step + 1 > index ? "text-[#252525]" : "text-slate-200"
                }`}
              >
                <div
                  className={`border rounded-full w-5 h-5 ${
                    step + 1 > index ? "border-blue-800" : "border-slate-200"
                  }`}
                />
                <p>
                  0{index + 1} {label}
                </p>
              </div>

              <div
                className={`w-56 h-[2px] md:w-32 bg-slate-400 rounded-lg ${
                  index === steps.length - 1 ? "hidden" : ""
                }`}
              />
            </Fragment>
          ))}
        </div>
        {/* Form yang Harus Diisi */}
        <div className="min-w-full rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full p-6 border-b-2 border-b-gray-200">
              <p className="font-thin text-[#282828] text-xl">{steps[step]}</p>
            </div>

            {step === 0 ? (
              <div className="flex md:space-x-6 items-start p-6 w-full">
                {/* Render your fields for step 0 using Controller */}
                {/* Input Gambar */}
                <div className="2xl:w-[10%] md:w-[15%]">
                  <Controller
                    name="image"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <div className="">
                        {field.value && field.value instanceof File ? (
                          <>
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt="Profile Picture"
                              width={400}
                              height={400}
                              className="rounded-full w-32 h-32 mx-auto border-4 border-blueBase mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
                            />
                          </>
                        ) : (
                          <Image
                            src={`${apiURL}/images/${employeeData.image}`}
                            alt="Profile Picture"
                            width={400}
                            height={400}
                            className="rounded-full w-32 h-32 mx-auto border-4 border-blueBase mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
                          />
                        )}
                        <label className="flex justify-center items-center cursor-pointer group">
                          <span className="inline-flex items-center">
                            <svg
                              data-slot="icon"
                              className="w-8 h-8 text-blue-700 group-hover:text-blue-500 dark:group-hover:text-gray-600
                                transition-transform duration-200 ease-in-out group-hover:scale-100 group-active:scale-75"
                              fill="none"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                              ></path>
                            </svg>
                          </span>
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#FFFFFF] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            {"<"} 2 MB
                          </span>
                          <input
                            {...field}
                            type="file"
                            value={undefined}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleFileChange(
                                e,
                                field.onChange,
                                field.name as keyof Employee
                              );
                            }}
                          />
                        </label>
                        <span className="text-errorFormColor text-xs">
                          {errors.image && <p>{errors.image.message}</p>}
                        </span>
                      </div>
                    )}
                  />
                </div>

                <div className="2xl:w-3/4 md:w-[85%] flex flex-col space-y-6 px-6">
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Nomor Karyawan</p>
                    <div className="w-3/4">
                      <Controller
                        name="employeeNumber"
                        control={control}
                        rules={{
                          required: "Nomor Karyawan harus diisi",
                          validate: (value) => {
                            const cleanedValue = value.replace(/[^\d]/g, ""); // Hapus karakter selain angka
                            // Validasi panjang nomor pegawai harus 11 digit
                            if (cleanedValue.length !== 11) {
                              return "Nomor pegawai harus 11 digit";
                            }

                            // Validasi hanya angka yang diperbolehkan
                            if (!/^[0-9]+$/.test(cleanedValue)) {
                              return "Hanya angka yang valid";
                            }

                            // Validasi perulangan untuk cek duplikasi
                            const isDuplicate = checkDuplicate(
                              cleanedValue,
                              existingEmployeeNumbers
                            );

                            if (
                              isDuplicate &&
                              cleanedValue !== employeeData.employeeNumber
                            ) {
                              return "Nomor pegawai sudah terdaftar";
                            }
                            return true;
                          },
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?(\.[0-9]+)?$/, // Validasi: hanya angka dan titik yang diperbolehkan
                            message: "Only valid numeric values are allowed",
                          },
                        }}
                        defaultValue={employeeData.employeeNumber}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="employeeNumber"
                            maxLength={11}
                            onKeyDown={inputNumberOnly}
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.employeeNumber && (
                          <p>{errors.employeeNumber.message}</p>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Nama</p>
                    <div className="w-3/4">
                      <Controller
                        name="fullName"
                        control={control}
                        rules={{
                          required: "Nama harus diisi",
                          minLength: {
                            value: 3,
                            message: "Nama harus lebih dari 3 karakter",
                          },
                        }}
                        defaultValue={employeeData.fullName}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="name"
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.fullName && <p>{errors.fullName.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>NIK</p>
                    <div className="w-3/4">
                      <Controller
                        name="idCardNumber"
                        control={control}
                        rules={{
                          required: "NIK harus diisi",
                          validate: (value) => {
                            const cleanedValue = value.replace(/[^\d]/g, ""); // Hapus karakter selain angka

                            if (cleanedValue.length !== 16)
                              return "NIK harus 16 digit";
                            if (!/^[0-9]+$/.test(cleanedValue)) {
                              return "Hanya angka yang valid";
                            }
                            const isDuplicate = checkDuplicate(
                              cleanedValue,
                              existingIdCardNumber
                            );
                            if (
                              isDuplicate &&
                              cleanedValue !== employeeData.idCardNumber
                            ) {
                              return "Nomor pegawai sudah terdaftar";
                            }

                            return true;
                          },
                          // validate: async (value) => {
                          //   const isUnique = await checkUniqueData(
                          //     value,
                          //     "idCardNumber",
                          //     // Update the following line to your API endpoint
                          //     "https://your-api-endpoint.com/check-unique-nik"
                          //   );
                          //   return isUnique;
                          // },
                        }}
                        defaultValue={employeeData.idCardNumber}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="idCardNumber"
                            maxLength={16}
                            onKeyDown={inputNumberOnly}
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.idCardNumber && (
                          <p>{errors.idCardNumber.message}</p>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Alamat</p>
                    <div className="w-3/4">
                      <Controller
                        name="address"
                        control={control}
                        rules={{
                          required: "Alamat harus diisi",
                          minLength: {
                            value: 3,
                            message: "Alamat harus lebih dari 3 karakter",
                          },
                        }}
                        defaultValue={employeeData.address}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="address"
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.address && <p>{errors.address.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Tempat Lahir</p>
                    <div className="w-3/4">
                      <Controller
                        name="birth"
                        control={control}
                        rules={{
                          required: "Tempat lahir harus diisi",
                          minLength: {
                            value: 3,
                            message: "Tempat lahir harus lebih dari 3 karakter",
                          },
                        }}
                        defaultValue={employeeData.birth}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="birth"
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.birth && <p>{errors.birth.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Tanggal Lahir</p>
                    <div className="w-3/4">
                      <Controller
                        name="birthDate"
                        control={control}
                        rules={{
                          required: "Tanggal lahir harus diisi",
                        }}
                        defaultValue={employeeData.birthDate.slice(0, 10)}
                        render={({ field }) => (
                          <div className="relative max-w-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              type="date" // Native date input
                              onChange={(e) => {
                                // Format the date as yyyy-MM-dd before submitting
                                const formattedDate = e.target.value; // e.target.value will be in yyyy-MM-dd format
                                field.onChange(formattedDate); // Set the value to React Hook Form
                              }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Select date"
                            />
                          </div>
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.birthDate && <p>{errors.birthDate.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Jenis Kelamin</p>
                    <div className="w-3/4">
                      <Controller
                        name="gender"
                        control={control}
                        defaultValue={employeeData.gender}
                        rules={{
                          required: "Jenis kelamin harus diisi",
                        }}
                        render={({ field }) => (
                          <div className="flex gap-4">
                            <div>
                              <input
                                {...field}
                                type="radio"
                                value="pria"
                                checked={field.value === "pria"}
                                id="pria"
                                className="mr-2"
                              />
                              <label htmlFor="pria">Pria</label>
                            </div>
                            <input
                              {...field}
                              type="radio"
                              value="wanita"
                              checked={field.value === "wanita"}
                              id="wanita"
                              className="mr-2"
                            />
                            <label htmlFor="wanita">Wanita</label>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Agama</p>
                    <div className="w-3/4">
                      <Controller
                        name="religion"
                        control={control}
                        rules={{
                          required: "Agama harus diisi",
                        }}
                        defaultValue={employeeData.religion}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          >
                            <option value="">Pilih Agama</option>
                            <option value="islam">Islam</option>
                            <option value="katholik">Katholik</option>
                            <option value="protestan">Kristen Protestan</option>
                            <option value="hindu">Hindu</option>
                            <option value="budha">Budha</option>
                          </select>
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.religion && <p>{errors.religion.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Email</p>
                    <div className="w-3/4">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Email harus diisi",
                          validate: (value) => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(value))
                              return "Format email salah";

                            const uniqueEmail = checkDuplicate(
                              value,
                              existingEmail
                            );

                            if (uniqueEmail && value !== employeeData.email) {
                              return "Email sudah terdaftar";
                            }

                            return true;
                          },
                        }}
                        defaultValue={employeeData.email}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="address"
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.email && <p>{errors.email.message}</p>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>Nomor Whatsapp</p>
                    <div className="w-3/4">
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: "Kontak harus diisi",
                          minLength: {
                            value: 9,
                            message: "Nomor kontak harus lebih dari 9 karakter",
                          },
                          validate: (value) => {
                            const phoneRegex = /^\+?[0-9]{9,15}$/;
                            if (!phoneRegex.test(value))
                              return "Format nomor kontak salah";
                            const uniquePhone = checkDuplicate(
                              value,
                              existingPhone
                            );
                            if (uniquePhone && value !== employeeData.phone) {
                              return "Nomor kontak sudah terdaftar";
                            }
                            return true;
                          },
                        }}
                        defaultValue={employeeData.phone}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="phone"
                            onKeyDown={inputNumberOnly}
                            className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          />
                        )}
                      />
                      <span className="text-errorFormColor text-xs">
                        {errors.phone && <p>{errors.phone.message}</p>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="2xl:w-3/4 md:w-full flex flex-col space-y-6 p-6">
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Pendidikan Terakhir</p>
                  <div className="w-3/4">
                    <Controller
                      name="education"
                      control={control}
                      rules={{
                        required: "Pendidikan terakhir harus diisi",
                      }}
                      defaultValue={employeeData.education}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="education"
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                        />
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.education && <p>{errors.education.message}</p>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Sekolah/Universitas</p>
                  <div className="w-3/4">
                    <Controller
                      name="school"
                      control={control}
                      rules={{
                        required: "Pendidikan harus diisi",
                      }}
                      defaultValue={employeeData.school}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="school"
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                        />
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.school && <p>{errors.school.message}</p>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Jurusan</p>
                  <div className="w-3/4">
                    <Controller
                      name="major"
                      control={control}
                      rules={{
                        required: "Jurusan harus diisi harus diisi",
                      }}
                      defaultValue={employeeData.major}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="major"
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                        />
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.major && <p>{errors.major.message}</p>}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="2xl:w-3/4 md:w-full flex flex-col space-y-6 p-6">
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Posisi</p>
                  <div className="w-3/4">
                    <Controller
                      name="position"
                      control={control}
                      rules={{
                        required: "Posisi harus diisi",
                      }}
                      defaultValue={employeeData.position}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="position"
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                        />
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.position && <p>{errors.position.message}</p>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Status</p>
                  <div className="w-3/4">
                    <Controller
                      name="status"
                      control={control}
                      rules={{
                        required: "Status harus diisi",
                      }}
                      defaultValue={employeeData.status}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                        >
                          <option value="">Pilih Status</option>
                          <option value="ACTIVE">Aktif</option>
                          <option value="ONLEAVE">Cuti</option>
                          <option value="RESIGN">Berhenti</option>
                        </select>
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.status && <p>{errors.status.message}</p>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Tanggal Mulai</p>
                  <div className="w-3/4">
                    <Controller
                      name="hireDate"
                      control={control}
                      rules={{
                        required: "Tanggal mulai bekerja harus diisi",
                      }}
                      defaultValue={employeeData.hireDate.slice(0, 10)}
                      render={({ field }) => (
                        <div className="relative max-w-sm">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>

                          <input
                            {...field}
                            type="date" // Native date input
                            onChange={(e) => {
                              // Format the date as yyyy-MM-dd before submitting
                              const formattedDate = e.target.value; // e.target.value will be in yyyy-MM-dd format
                              field.onChange(formattedDate); // Set the value to React Hook Form
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date"
                          />
                        </div>
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.hireDate && <p>{errors.hireDate.message}</p>}
                    </span>
                  </div>
                </div>
                {status === "ACTIVE" ||
                (employeeData.status === "ACTIVE" && !status) ? (
                  <></>
                ) : (
                  <div className="flex items-center space-x-4 justify-between w-3/4 ">
                    <p>
                      Tanggal{" "}
                      {status === "ONLEAVE" ||
                      (employeeData.status === "ONLEAVE" && !status)
                        ? "Cuti"
                        : "Berhenti"}
                    </p>
                    <div className="w-3/4">
                      <Controller
                        name={status === "ONLEAVE" ? "leaveDate" : "resignDate"}
                        control={control}
                        rules={{
                          required: `Tanggal ${
                            status === "ONLEAVE" ||
                            (employeeData.status === "ONLEAVE" && !status)
                              ? "Cuti"
                              : "Berhenti"
                          } harus diisi`,
                        }}
                        defaultValue={
                          status === "ONLEAVE" ||
                          (employeeData.status === "ONLEAVE" && !status)
                            ? employeeData.leaveDate
                              ? employeeData.leaveDate.slice(0, 10)
                              : ""
                            : employeeData.resignDate
                            ? employeeData.resignDate.slice(0, 10)
                            : ""
                        }
                        render={({ field }) => (
                          <div className="relative max-w-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                              </svg>
                            </div>

                            <input
                              {...field}
                              type="date" // Native date input
                              // onChange={(e) => {
                              //   // Format the date as yyyy-MM-dd before submitting
                              //   const formattedDate = e.target.value; // e.target.value will be in yyyy-MM-dd format
                              //   field.onChange(formattedDate); // Set the value to React Hook Form
                              // }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Select date"
                            />
                          </div>
                        )}
                      />
                      {status === "ONLEAVE" ? (
                        <span className="text-errorFormColor text-xs">
                          {errors.leaveDate && (
                            <p>{errors.leaveDate.message}</p>
                          )}
                        </span>
                      ) : (
                        <span className="text-errorFormColor text-xs">
                          {errors.resignDate && (
                            <p>{errors.resignDate.message}</p>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4 justify-between w-3/4 ">
                  <p>Gaji</p>
                  <div className="w-3/4">
                    <Controller
                      name="salary"
                      control={control}
                      rules={{
                        required: "Nilai gaji harus diisi",
                      }}
                      defaultValue={employeeData.salary}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="salary"
                          type="text"
                          className="w-full ring-1 ring-gray-400 rounded-md px-2 py-2"
                          value={FormatCurrency(field.value)}
                          onChange={(e) => HandleCurrencyChange(e, field)}
                        />
                      )}
                    />
                    <span className="text-errorFormColor text-xs">
                      {errors.salary && <p>{errors.salary.message}</p>}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="w-full grid grid-cols-2 gap-6 p-6">
                <div className="space-y-2 w-auto">
                  <p>KTP</p>
                  <div className="w-fit">
                    <Controller
                      name="document.idCard"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          {field.value && field.value instanceof File ? (
                            <>
                              <a
                                href={URL.createObjectURL(field.value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                <p>
                                  {field.value
                                    ? field.value.name.length <= 20
                                      ? field.value.name
                                      : field.value.name.slice(0, 20) + "..."
                                    : ""}
                                </p>
                              </a>
                              <p
                                className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-red-600 dark:text-gray-400
                                  transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                onClick={() => {
                                  field.onChange(null); // Clears the file field
                                }}
                              >
                                Batal
                              </p>
                            </>
                          ) : (
                            <>
                              <a
                                href={`${apiURL}/ktp/${employeeData.document.idCard}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                {employeeData?.document.idCard &&
                                typeof employeeData.document.idCard === "string"
                                  ? employeeData.document.idCard.length <= 20
                                    ? employeeData.document.idCard
                                    : employeeData.document.idCard.slice(
                                        0,
                                        20
                                      ) + "..."
                                  : null}
                              </a>
                              <label>
                                <p
                                  className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-blueBase dark:text-gray-400
                                   transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                >
                                  Click to Upload File
                                </p>
                                <input
                                  {...field}
                                  type="file"
                                  value={undefined}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChange(
                                      e,
                                      field.onChange,
                                      field.name as keyof Employee
                                    );
                                  }}
                                />
                              </label>
                            </>
                          )}
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#EBF2FD] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            Image
                          </span>
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#FFFFFF] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            {"<"} 2 MB
                          </span>
                        </div>
                      )}
                    />
                    {errors.document?.idCard && (
                      <p className="text-red-500 text-sm">
                        {errors.document?.idCard.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 w-auto">
                  <p>NPWP</p>
                  <div className="w-fit">
                    <Controller
                      name="document.taxCard"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          {field.value && field.value instanceof File ? (
                            <>
                              <a
                                href={URL.createObjectURL(field.value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                <p>
                                  {field.value
                                    ? field.value.name.length <= 20
                                      ? field.value.name
                                      : field.value.name.slice(0, 20) + "..."
                                    : ""}
                                </p>
                              </a>
                              <p
                                className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-red-600 dark:text-gray-400
                                  transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                onClick={() => {
                                  field.onChange(null); // Clears the file field
                                }}
                              >
                                Batal
                              </p>
                            </>
                          ) : (
                            <>
                              <a
                                href={`${apiURL}/npwp/${employeeData.document.idCard}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                {employeeData?.document.taxCard &&
                                typeof employeeData.document.taxCard ===
                                  "string"
                                  ? employeeData.document.taxCard.length <= 20
                                    ? employeeData.document.taxCard
                                    : employeeData.document.taxCard.slice(
                                        0,
                                        20
                                      ) + "..."
                                  : null}
                              </a>
                              <label>
                                <p
                                  className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-blueBase dark:text-gray-400
                                   transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                >
                                  Click to Upload File
                                </p>
                                <input
                                  {...field}
                                  type="file"
                                  value={undefined}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChange(
                                      e,
                                      field.onChange,
                                      field.name as keyof Employee
                                    );
                                  }}
                                />
                              </label>
                            </>
                          )}
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#EBF2FD] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            Image
                          </span>
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#FFFFFF] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            {"<"} 2 MB
                          </span>
                        </div>
                      )}
                    />
                    {errors.document?.taxCard && (
                      <p className="text-red-500 text-sm">
                        {errors.document?.taxCard.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 w-auto">
                  <p>Kartu Keluarga</p>
                  <div className="w-fit">
                    <Controller
                      name="document.familyCard"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          {field.value && field.value instanceof File ? (
                            <>
                              <a
                                href={URL.createObjectURL(field.value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                <p>
                                  {field.value
                                    ? field.value.name.length <= 20
                                      ? field.value.name
                                      : field.value.name.slice(0, 20) + "..."
                                    : ""}
                                </p>
                              </a>
                              <p
                                className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-red-600 dark:text-gray-400
                                  transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                onClick={() => {
                                  field.onChange(null); // Clears the file field
                                }}
                              >
                                Batal
                              </p>
                            </>
                          ) : (
                            <>
                              <a
                                href={`${apiURL}/kartukeluarga/${employeeData.document.familyCard}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                {employeeData?.document.familyCard &&
                                typeof employeeData.document.familyCard ===
                                  "string"
                                  ? employeeData.document.familyCard.length <=
                                    20
                                    ? employeeData.document.familyCard
                                    : employeeData.document.familyCard.slice(
                                        0,
                                        20
                                      ) + "..."
                                  : null}
                              </a>
                              <label>
                                <p
                                  className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-blueBase dark:text-gray-400
                                   transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                >
                                  Click to Upload File
                                </p>
                                <input
                                  {...field}
                                  type="file"
                                  value={undefined}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChange(
                                      e,
                                      field.onChange,
                                      field.name as keyof Employee
                                    );
                                  }}
                                />
                              </label>
                            </>
                          )}
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#EBF2FD] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            Image
                          </span>
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#FFFFFF] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            {"<"} 2 MB
                          </span>
                        </div>
                      )}
                    />
                    {errors.document?.familyCard && (
                      <p className="text-red-500 text-sm">
                        {errors.document?.familyCard.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 w-auto">
                  <p>Ijazah Terakhir</p>
                  <div className="w-fit">
                    <Controller
                      name="document.diploma"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          {field.value && field.value instanceof File ? (
                            <>
                              <a
                                href={URL.createObjectURL(field.value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                <p>
                                  {field.value
                                    ? field.value.name.length <= 20
                                      ? field.value.name
                                      : field.value.name.slice(0, 20) + "..."
                                    : ""}
                                </p>
                              </a>
                              <p
                                className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-red-600 dark:text-gray-400
                                  transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                onClick={() => {
                                  field.onChange(null); // Clears the file field
                                }}
                              >
                                Batal
                              </p>
                            </>
                          ) : (
                            <>
                              <a
                                href={`${apiURL}/ijazah/${employeeData.document.diploma}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-52 text-blue-500 hover:underline focus:outline-none focus:ring focus:border-blue-300"
                              >
                                {employeeData?.document.diploma &&
                                typeof employeeData.document.diploma ===
                                  "string"
                                  ? employeeData.document.diploma.length <= 20
                                    ? employeeData.document.diploma
                                    : employeeData.document.diploma.slice(
                                        0,
                                        20
                                      ) + "..."
                                  : null}
                              </a>
                              <label>
                                <p
                                  className="text-sm text-gray-50 rounded-lg cursor-pointer px-2 py-2 bg-blueBase dark:text-gray-400
                                   transition transform duration-200 ease-in-out hover:scale-100 active:scale-95
                                  focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium"
                                >
                                  Click to Upload File
                                </p>
                                <input
                                  {...field}
                                  type="file"
                                  value={undefined}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleFileChange(
                                      e,
                                      field.onChange,
                                      field.name as keyof Employee
                                    );
                                  }}
                                />
                              </label>
                            </>
                          )}
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#EBF2FD] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            Image
                          </span>
                          <span className="text-sm text-blueBase rounded-lg border-2 border-gray-50 px-2 py-2 bg-[#FFFFFF] dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-medium">
                            {"<"} 2 MB
                          </span>
                        </div>
                      )}
                    />
                    {errors.document?.diploma && (
                      <p className="text-red-500 text-sm">
                        {errors.document?.diploma.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="w-full p-6 border-t-2 border-t-gray-200 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={step > 0 ? false : true}
                className={`w-24 rounded-lg border-2 px-2 py-2 dark:placeholder-gray-400 font-medium 
                  transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95
                  ${
                    step > 0
                      ? "text-[#252525] border-gray-600 dark:border-gray-600 hover:border-blueBase hover:text-blueBase hover:bg-blueBg"
                      : "text-slate-200 border-gray-200 dark:border-gray-600 "
                  }`}
              >
                Previous
              </button>

              {step < steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  onKeyDown={(e) => {
                    // Menangani Enter atau Space key
                    if (e.key === "Enter" || e.key === " ") {
                      handleNext();
                    }
                  }}
                  className={`w-24 rounded-lg border-2 px-2 py-2 dark:placeholder-gray-400 font-medium 
                    transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95
                    ${
                      step < steps.length - 1
                        ? "text-[#252525] border-gray-600 dark:border-gray-600 hover:border-blueBase hover:text-blueBase hover:bg-blueBg"
                        : "text-slate-200 border-gray-200 dark:border-gray-600 "
                    }`}
                  // disabled={!isValid}
                >
                  Next
                </button>
              )}

              {step === steps.length - 1 && (
                <button
                  type="submit"
                  className={`w-24 rounded-lg border-2 flex justify-center items-center dark:placeholder-gray-400 font-medium transition duration-200 transform
                    ${
                      loadSubmit
                        ? "text-slate-200 border-gray-200 dark:border-gray-600 cursor-none scale-95"
                        : "hover:border-blueBase hover:text-blueBase hover:bg-blueBg border-gray-600 dark:border-gray-600 scale-100"
                    }
                  `}
                  disabled={loading}
                >
                  {loadSubmit ? (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 text-blueBase animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <p>Save</p>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
