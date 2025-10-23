"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"; // sesuaikan

export default function CategoryMaterialUI({ projectId = "1" }) {
  const [categories, setCategories] = useState([]);
  const [uncategorizedMaterials, setUncategorizedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data dari backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/budget/${projectId}`);
        const data = await res.json();
        setCategories(data.categories || []);
        setUncategorizedMaterials(data.uncategorizedMaterials || []);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  // 🔹 Tambah kategori baru
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: "", materials: [], children: [] },
    ]);
  };

  // 🔹 Update kategori
  const updateCategory = (index, updatedCategory) => {
    const newCategories = [...categories];
    newCategories[index] = updatedCategory;
    setCategories(newCategories);
  };

  // 🔹 Hapus kategori
  const removeCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Tambah / update / hapus material tanpa kategori
  const addUncategorizedMaterial = () => {
    setUncategorizedMaterials((prev) => [
      ...prev,
      {
        name: "",
        qty: 1,
        unit: "pcs",
        frequency: "1",
        duration: "2 hari",
        harga: 0,
      },
    ]);
  };
  const updateUncategorizedMaterial = (i, updated) => {
    const newMaterials = [...uncategorizedMaterials];
    newMaterials[i] = updated;
    setUncategorizedMaterials(newMaterials);
  };
  const removeUncategorizedMaterial = (i) => {
    setUncategorizedMaterials((prev) => prev.filter((_, idx) => idx !== i));
  };

  // 🔹 Simpan ke backend
  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        projectId,
        categories,
        uncategorizedMaterials,
      };

      console.log(JSON.stringify(payload, null, 2));

      // const res = await fetch(`${API_URL}/budget/update`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!res.ok) throw new Error("Gagal menyimpan data");
      alert("Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manajemen Kategori & Material</h1>

      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      <div className="flex gap-2 mb-4">
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah Kategori
        </button>
        <button
          onClick={addUncategorizedMaterial}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah Material
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          💾 Simpan
        </button>
      </div>

      {/* MATERIAL TANPA KATEGORI */}
      {uncategorizedMaterials.length > 0 && (
        <div className="mb-4">
          <h2 className="text-md font-semibold mb-2">
            Material Tanpa Kategori
          </h2>
          <div className="space-y-2">
            {uncategorizedMaterials.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={m.name}
                  onChange={(e) => {
                    const updated = { ...m, name: e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  placeholder="Nama Material"
                  className="border px-2 py-1"
                />
                <input
                  type="number"
                  value={m.qty}
                  onChange={(e) => {
                    const updated = { ...m, qty: +e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  className="w-16 border px-2 py-1"
                  placeholder="Qty"
                />
                <input
                  type="text"
                  value={m.unit}
                  onChange={(e) => {
                    const updated = { ...m, unit: e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  className="w-16 border px-2 py-1"
                  placeholder="Unit"
                />
                <input
                  type="text"
                  value={m.frequency}
                  onChange={(e) => {
                    const updated = { ...m, frequency: e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  className="w-16 border px-2 py-1"
                  placeholder="Frequency"
                />
                <input
                  type="text"
                  value={m.duration}
                  onChange={(e) => {
                    const updated = { ...m, duration: e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  className="w-16 border px-2 py-1"
                  placeholder="Duration"
                />
                <input
                  type="number"
                  value={m.harga}
                  onChange={(e) => {
                    const updated = { ...m, harga: +e.target.value };
                    updateUncategorizedMaterial(i, updated);
                  }}
                  className="w-24 border px-2 py-1"
                  placeholder="Harga"
                />
                <button
                  onClick={() => removeUncategorizedMaterial(i)}
                  className="text-red-500"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KATEGORI + SUBKATEGORI */}
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i} className="relative border p-2 rounded">
            <CategoryNode
              data={cat}
              onChange={(updated) => updateCategory(i, updated)}
            />
            <button
              onClick={() => removeCategory(i)}
              className="absolute top-0 right-0 text-red-500 text-sm"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================================================
// 🔹 Komponen Rekursif CategoryNode (Subkategori)
// =================================================

function CategoryNode({ data, onChange }) {
  const [name, setName] = useState(data.name || "");
  const [children, setChildren] = useState(data.children || []);
  const [materials, setMaterials] = useState(data.materials || []);

  const addSubcategory = () =>
    setChildren((prev) => [...prev, { name: "", materials: [], children: [] }]);
  const addMaterial = () =>
    setMaterials((prev) => [
      ...prev,
      { name: "", qty: 1, unit: "pcs", frequency: "", duration: "", harga: 0 },
    ]);
  const removeMaterial = (i) =>
    setMaterials((prev) => prev.filter((_, idx) => idx !== i));
  const updateMaterial = (i, updated) => {
    const newMats = [...materials];
    newMats[i] = updated;
    setMaterials(newMats);
  };
  const updateSubcategory = (i, updated) => {
    const newChildren = [...children];
    newChildren[i] = updated;
    setChildren(newChildren);
  };

  // Sinkronisasi data ke parent
  useEffect(() => {
    onChange({ name, materials, children });
  }, [name, materials, children]);

  return (
    <div className="ml-4 border-l-2 pl-4 pb-4 mt-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Kategori"
        className="border-b w-full mb-2"
      />

      {/* MATERIAL */}
      <div className="space-y-2">
        {materials.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={m.name}
              onChange={(e) =>
                updateMaterial(i, { ...m, name: e.target.value })
              }
              placeholder="Nama Material"
              className="border px-2 py-1"
            />
            <input
              type="number"
              value={m.qty}
              onChange={(e) =>
                updateMaterial(i, { ...m, qty: +e.target.value })
              }
              className="w-16 border px-2 py-1"
              placeholder="Qty"
            />
            <input
              type="text"
              value={m.unit}
              onChange={(e) =>
                updateMaterial(i, { ...m, unit: e.target.value })
              }
              className="w-16 px-2 border py-1"
              placeholder="Unit"
            />
            <input
              type="text"
              value={m.frequency}
              onChange={(e) =>
                updateMaterial(i, { ...m, frequency: e.target.value })
              }
              className="w-16 border px-2 py-1"
              placeholder="Frequency"
            />
            <input
              type="text"
              value={m.duration}
              onChange={(e) =>
                updateMaterial(i, { ...m, duration: e.target.value })
              }
              className="w-16 border px-2 py-1"
              placeholder="Duration"
            />
            <input
              type="number"
              value={m.harga}
              onChange={(e) =>
                updateMaterial(i, { ...m, harga: +e.target.value })
              }
              className="w-24 border px-2 py-1"
              placeholder="Harga"
            />
            <button onClick={() => removeMaterial(i)} className="text-red-500">
              Hapus
            </button>
          </div>
        ))}
      </div>

      {/* BUTTON ACTION */}
      <div className="flex gap-2 mt-2">
        <button onClick={addMaterial} className="text-blue-600 text-sm">
          + Tambah Material
        </button>
        <button onClick={addSubcategory} className="text-blue-600 text-sm">
          + Tambah Subkategori
        </button>
      </div>

      {/* RENDER SUBKATEGORI */}
      <div className="mt-4 space-y-4">
        {children.map((child, i) => (
          <CategoryNode
            key={i}
            data={child}
            onChange={(updated) => updateSubcategory(i, updated)}
          />
        ))}
      </div>
    </div>
  );
}
