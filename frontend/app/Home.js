"use client";

import Link from "next/link";

const navigationItems = [
  { id: "home", label: "Home", icon: "🏠", page: "/?page=home" },
  { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "/?page=permintaan-lapangan" },
  { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "/?page=purchase-order" },
  { id: "material", label: "Material", icon: "📦", page: "/?page=material" },
];

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Procurement</h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4">
        {navigationItems.map((item) => (
          <Link key={item.id} href={item.page}>
            <div className="border px-4 py-2 cursor-pointer rounded-md shadow hover:bg-gray-200 transition">
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
