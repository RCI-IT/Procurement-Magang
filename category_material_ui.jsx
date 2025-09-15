import { useState } from "react";

const initialData = [];

export default function CategoryMaterialUI() {
  const [categories, setCategories] = useState(initialData);
  const [uncategorizedMaterials, setUncategorizedMaterials] = useState([]);

  const addCategory = () => {
    setCategories((prev) => [...prev, { name: "", children: [] }]);
  };

  const updateCategory = (index, updatedCategory) => {
    const newCategories = [...categories];
    newCategories[index] = updatedCategory;
    setCategories(newCategories);
  };

  const removeCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const addUncategorizedMaterial = () => {
    setUncategorizedMaterials((prev) => [
      ...prev,
      { name: "", qty: 1, harga: 0 },
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manajemen Kategori & Material</h1>
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
      </div>

      {uncategorizedMaterials.length > 0 && (
        <div className="mb-4">
          <h2 className="text-md font-semibold mb-2">Material Tanpa Kategori</h2>
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

      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i} className="relative">
            <CategoryNode
              data={cat}
              onChange={(updated) => updateCategory(i, updated)}
            />
            <button
              onClick={() => removeCategory(i)}
              className="absolute top-0 right-0 text-red-500 text-sm"
            >
              Hapus Kategori
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryNode({ data, onChange }) {
  const [name, setName] = useState(data.name || "");
  const [children, setChildren] = useState(data.children || []);
  const [materials, setMaterials] = useState(data.materials || []);

  const addSubcategory = () => {
    setChildren((prev) => [...prev, { name: "", children: [] }]);
  };

  const addMaterial = () => {
    setMaterials((prev) => [...prev, { name: "", qty: 1, harga: 0 }]);
  };

  const updateSubcategory = (i, updated) => {
    const newChildren = [...children];
    newChildren[i] = updated;
    setChildren(newChildren);
  };

  const updateMaterial = (i, updated) => {
    const newMaterials = [...materials];
    newMaterials[i] = updated;
    setMaterials(newMaterials);
  };

  const removeMaterial = (i) => {
    setMaterials((prev) => prev.filter((_, idx) => idx !== i));
  };

  const sync = () => {
    onChange({ name, children, materials });
  };

  return (
    <div className="ml-4 border-l-2 pl-4 pb-4">
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          sync();
        }}
        onBlur={sync}
        placeholder="Nama Kategori"
        className="border-b w-full mb-2"
      />

      <div className="space-y-2">
        {materials.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={m.name}
              onChange={(e) => {
                const updated = { ...m, name: e.target.value };
                updateMaterial(i, updated);
                sync();
              }}
              placeholder="Nama Material"
              className="border px-2 py-1"
            />
            <input
              type="number"
              value={m.qty}
              onChange={(e) => {
                const updated = { ...m, qty: +e.target.value };
                updateMaterial(i, updated);
                sync();
              }}
              className="w-16 border px-2 py-1"
              placeholder="Qty"
            />
            <input
              type="number"
              value={m.harga}
              onChange={(e) => {
                const updated = { ...m, harga: +e.target.value };
                updateMaterial(i, updated);
                sync();
              }}
              className="w-24 border px-2 py-1"
              placeholder="Harga"
            />
            <button
              onClick={() => {
                removeMaterial(i);
                sync();
              }}
              className="text-red-500"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => {
            addMaterial();
            sync();
          }}
          className="text-blue-600 text-sm"
        >
          + Tambah Material
        </button>
        <button
          onClick={() => {
            addSubcategory();
            sync();
          }}
          className="text-blue-600 text-sm"
        >
          + Tambah Subkategori
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {children.map((child, i) => (
          <CategoryNode
            key={i}
            data={child}
            onChange={(updated) => {
              updateSubcategory(i, updated);
              sync();
            }}
          />
        ))}
      </div>
    </div>
  );
}
