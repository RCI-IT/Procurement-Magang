"use client";

export default function Material() {
  const materials = [
    { id: 1, name: "", image: "", vendor: "", price: "" },
    { id: 2, name: "", image: "", vendor: "", price: "" },
    { id: 3, name: "", image: "", vendor: "", price: "" },
    { id: 4, name: "", image: "", vendor: "", price: "" },
    { id: 5, name: "", image: "", vendor: "", price: "" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Material</h1>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Gambar</th>
            <th className="border border-gray-300 px-4 py-2">Vendor</th>
            <th className="border border-gray-300 px-4 py-2">Harga</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, index) => (
            <tr key={material.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{material.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {material.image ? (
                  <img src={material.image} alt={material.name} className="w-16 h-16 object-cover" />
                ) : (
                  "-"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{material.vendor}</td>
              <td className="border border-gray-300 px-4 py-2">{material.price}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lihat</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
