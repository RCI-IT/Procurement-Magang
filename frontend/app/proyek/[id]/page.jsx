"use client";

export default function DetailProyek() {
  return (
    <div className="flex">
      <div className="p-6 flex-1">
        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <h2 className="text-3xl font-bold">{"Proyek Tidak Diketahui"}</h2>
          <p className="text-gray-600 text-sm">
            Kode : {"Kode tidak tersedia"}
          </p>
          <p className="text-gray-600 text-sm">
            Lokasi : {"Lokasi tidak tersedia"}
          </p>
          <p className="text-gray-600 text-sm">
            Status : {"Status tidak tersedia"}
          </p>
        </div>

        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <h2 className="text-2xl font-bold">Tim Proyek</h2>
          <ul className="list-disc ml-6">
              <li>
                 user.name  —  roleInProject
              </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
