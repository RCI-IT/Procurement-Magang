// app/proyek/[id]/penugasan/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormPenugasan({ projectId, users }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/penugasan", {
      method: "POST",
      body: JSON.stringify({
        userId: selectedUser,
        roleInProject: role,
        projectId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal menambahkan penugasan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* <Select onValueChange={setSelectedUser}>
        <SelectItem value="">Pilih User</SelectItem>
        {users.map((u) => (
          <SelectItem key={u.id} value={u.id}>
            {u.name}
          </SelectItem>
        ))}
      </Select>

      <Select onValueChange={setRole}>
        <SelectItem value="">Pilih Peran</SelectItem>
        <SelectItem value="Project Manager">Project Manager</SelectItem>
        <SelectItem value="Procurement">Procurement</SelectItem>
        <SelectItem value="PIC">PIC</SelectItem>
      </Select>

      <Button type="submit">Tambah Penugasan</Button> */}
    </form>
  );
}
