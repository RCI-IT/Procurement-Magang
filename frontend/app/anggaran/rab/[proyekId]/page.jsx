"use client";
import { useState } from "react";

const mockData = {
  projectId: "PRJ-001",
  categories: [
    {
      id: "cat-1",
      kategori: "Pekerjaan Persiapan",
      materials: [
        {
          id: "mat-1",
          name: "Mobilisasi Alat",
          qty: 2,
          unit: "unit",
          frequency: "1x",
          duration: "2 hari",
          harga: 1500000,
        },
      ],
      children: [
        {
          id: "cat-1-1",
          kategori: "Pembersihan Lahan",
          materials: [
            {
              id: "mat-2",
              name: "Tenaga Kerja",
              qty: 5,
              unit: "orang",
              frequency: "1x",
              duration: "3 hari",
              harga: 250000,
            },
            {
              id: "mat-3",
              name: "Peralatan Manual",
              qty: 3,
              unit: "set",
              frequency: "1x",
              duration: "3 hari",
              harga: 100000,
            },
          ],
          children: [
            {
              id: "cat-1-1-1",
              kategori: "Pembuangan Sampah",
              materials: [
                {
                  id: "mat-4",
                  name: "Truk Sampah",
                  qty: 1,
                  unit: "unit",
                  frequency: "1x",
                  duration: "1 hari",
                  harga: 500000,
                },
              ],
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "cat-2",
      kategori: "Pekerjaan Struktur",
      materials: [
        {
          id: "mat-5",
          name: "Besi Beton",
          qty: 100,
          unit: "kg",
          frequency: "1x",
          duration: "5 hari",
          harga: 12000,
        },
      ],
      children: [
        {
          id: "cat-2-1",
          kategori: "Pengecoran",
          materials: [
            {
              id: "mat-6",
              name: "Semen",
              qty: 50,
              unit: "sak",
              frequency: "1x",
              duration: "3 hari",
              harga: 75000,
            },
            {
              id: "mat-7",
              name: "Pasir",
              qty: 3,
              unit: "m³",
              frequency: "1x",
              duration: "3 hari",
              harga: 250000,
            },
          ],
          children: [],
        },
        {
          id: "cat-t-1", 
          kategori: "Pemasangan Tiang", 
          materials:[
            {
              id: "1234",
              name: "Bata", 
              qty: 5, 
              unit: "truk",
              frequency: "1",
              duration: "2 hari", 
              harga: 10000
            }
          ]
        }
      ],
    },
  ],
  uncategorizedMaterials: [
    {
      id: "mat-uncat-1",
      name: "Biaya Tak Terduga",
      qty: 1,
      unit: "paket",
      frequency: "1x",
      duration: "-",
      harga: 1000000,
    },
  ],
};

export default function EditableMaterialTable({ initialData = mockData }) {
  const [data, setData] = useState(initialData);

  // tracking perubahan
  const [changes, setChanges] = useState({
    added: { categories: [], materials: [] },
    updated: { categories: [], materials: [] },
    deleted: { categories: [], materials: [] },
  });

  // ubah nilai material
  const handleMaterialChange = (path, field, value) => {
    setData((prev) => {
      const updated = structuredClone(prev);
      let target = updated;
      for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
      const mat = target[path.at(-1)];
      mat[field] = value;

      // catat perubahan
      setChanges((prevChanges) => ({
        ...prevChanges,
        updated: {
          ...prevChanges.updated,
          materials: [
            ...prevChanges.updated.materials.filter((m) => m.id !== mat.id),
            mat,
          ],
        },
      }));

      return updated;
    });
  };

  // hapus material
  const handleDeleteMaterial = (path, index) => {
    setData((prev) => {
      const updated = structuredClone(prev);
      let target = updated;
      for (let i = 0; i < path.length; i++) target = target[path[i]];
      const deletedItem = target[index];
      target.splice(index, 1);

      setChanges((prev) => ({
        ...prev,
        deleted: {
          ...prev.deleted,
          materials: [...prev.deleted.materials, deletedItem],
        },
      }));

      return updated;
    });
  };

  // hapus kategori
  const handleDeleteCategory = (path, index) => {
    setData((prev) => {
      const updated = structuredClone(prev);
      let target = updated;
      for (let i = 0; i < path.length; i++) target = target[path[i]];
      const deletedCat = target[index];
      target.splice(index, 1);

      setChanges((prev) => ({
        ...prev,
        deleted: {
          ...prev.deleted,
          categories: [...prev.deleted.categories, deletedCat],
        },
      }));

      return updated;
    });
  };

  const renderMaterials = (materials = [], pathPrefix) => (
    <table className="w-full border border-gray-300 my-2 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Nama</th>
          <th className="p-2 border">Qty</th>
          <th className="p-2 border">Satuan</th>
          <th className="p-2 border">Frekuensi</th>
          <th className="p-2 border">Durasi</th>
          <th className="p-2 border">Harga</th>
          <th className="p-2 border w-20">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((mat, idx) => (
          <tr key={mat.id}>
            {["name", "qty", "unit", "frequency", "duration", "harga"].map(
              (field) => (
                <td key={field} className="border p-1">
                  <input
                    className="w-full border rounded p-1"
                    value={mat[field] ?? ""}
                    onChange={(e) =>
                      handleMaterialChange(
                        [...pathPrefix, idx],
                        field,
                        e.target.value
                      )
                    }
                  />
                </td>
              )
            )}
            <td className="border p-1 text-center">
              <button
                onClick={() => handleDeleteMaterial(pathPrefix, idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCategories = (categories = [], pathPrefix = ["categories"]) =>
    categories.map((cat, idx) => (
      <div key={cat.id} className="ml-4 mt-4 border-l-2 pl-4 relative">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-gray-700">{cat.kategori}</h3>
          <button
            onClick={() => handleDeleteCategory(pathPrefix, idx)}
            className="text-sm text-red-600 hover:underline"
          >
            Hapus Kategori
          </button>
        </div>
        {renderMaterials(cat.materials, [...pathPrefix, idx, "materials"])}
        {cat.children?.length > 0 && (
          <div className="ml-4">
            {renderCategories(cat.children, [...pathPrefix, idx, "children"])}
          </div>
        )}
      </div>
    ));

  const handleSave = () => {
    const payload = {
      projectId: data.projectId,
      updated: {
        categories: data.categories,
        uncategorizedMaterials: data.uncategorizedMaterials,
      },
      added: changes.added,
      deleted: changes.deleted,
    };

    console.log("📤 JSON dikirim ke backend:");
    console.log(JSON.stringify(payload, null, 2));

    // contoh POST ke backend:
    // fetch("/api/rab/update", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mt-4">
        <button
          // onClick={addCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah Kategori
        </button>
        <button
          // onClick={addUncategorizedMaterial}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah Material
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan Perubahan
        </button>
      </div>
      {/* MATERIAL TANPA KATEGORI */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">
        Material Tanpa Kategori
      </h2>
      {renderMaterials(data.uncategorizedMaterials, ["uncategorizedMaterials"])}
      
      {/* KATEGORI + SUBKATEGORI */}
      <h2 className="text-xl font-semibold mb-2 text-blue-700">
        Daftar Material Berdasarkan Kategori
      </h2>
      {renderCategories(data.categories)}
    </div>
  );
}
