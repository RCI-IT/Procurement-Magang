'use client'
import { useState } from "react";

export default function EditableMaterialTable({ initialData }) {
  const [data, setData] = useState(initialData);

  // 🔧 handle update field
  const handleMaterialChange = (categoryPath, index, field, value) => {
    const newData = structuredClone(data); // clone deep
    let current = newData.categories;
    for (const i of categoryPath) current = current[i].children;

    current[index].materials = current[index].materials.map((m, idx) =>
      idx === index ? { ...m, [field]: value } : m
    );
    setData(newData);
  };

  // 🔧 Render kategori & material bersarang
  const renderCategory = (category, level = 0, path = []) => (
    <div key={category.name} className="ml-4 mt-2 border-l pl-3">
      <h3 className="font-semibold text-gray-800">
        {Array(level).fill("— ").join("")}
        {category.name}
      </h3>

      {/* Tabel material */}
      {category.materials?.length > 0 && (
        <table className="w-full text-sm border mt-1">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Frekuensi</th>
              <th className="p-2 border">Durasi</th>
              <th className="p-2 border">Harga</th>
            </tr>
          </thead>
          <tbody>
            {category.materials.map((m, idx) => (
              <tr key={idx}>
                <td className="border p-1">
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "name", e.target.value)
                    }
                    className="w-full px-1 border rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={m.qty}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "qty", Number(e.target.value))
                    }
                    className="w-full px-1 border rounded text-right"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={m.unit}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "unit", e.target.value)
                    }
                    className="w-full px-1 border rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={m.frequency}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "frequency", e.target.value)
                    }
                    className="w-full px-1 border rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={m.duration}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "duration", e.target.value)
                    }
                    className="w-full px-1 border rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={m.harga}
                    onChange={(e) =>
                      handleMaterialChange(path, idx, "harga", Number(e.target.value))
                    }
                    className="w-full px-1 border rounded text-right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Render anak kategori */}
      {category.children?.map((child, i) =>
        renderCategory(child, level + 1, [...path, i])
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Daftar Kategori & Material</h2>
      {data.categories.map((cat, i) => renderCategory(cat, 0, [i]))}

      {/* Tanpa kategori */}
      {data.uncategorizedMaterials?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Tanpa Kategori</h3>
          <table className="w-full text-sm border mt-1">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Frekuensi</th>
                <th className="p-2 border">Durasi</th>
                <th className="p-2 border">Harga</th>
              </tr>
            </thead>
            <tbody>
              {data.uncategorizedMaterials.map((m, idx) => (
                <tr key={idx}>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].name = e.target.value;
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={m.qty}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].qty = Number(e.target.value);
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded text-right"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={m.unit}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].unit = e.target.value;
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={m.frequency}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].frequency = e.target.value;
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].duration = e.target.value;
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={m.harga}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.uncategorizedMaterials[idx].harga = Number(e.target.value);
                        setData(newData);
                      }}
                      className="w-full px-1 border rounded text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <pre className="mt-4 text-xs bg-gray-50 p-2 border rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
