"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPermintaanLapangan = exports.deletePermintaanLapangan = exports.updateStatusPermintaan = exports.getPermintaanById = exports.getAllPermintaanLapangan = exports.createPermintaanLapangan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PermintaanStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
};
const createPermintaanLapangan = async (req, res) => {
    try {
        const { nomor, tanggal, lokasi, picLapangan, keterangan, detail } = req.body;
        // ✅ Validasi input agar tidak ada data yang kosong atau tidak sesuai
        if (!nomor || !tanggal || !lokasi || !picLapangan || !Array.isArray(detail)) {
            res.status(400).json({ error: "Harap isi semua field yang diperlukan" });
            return;
        }
        // ✅ Pastikan `detail` berisi array dengan objek yang memiliki properti yang benar
        const isDetailValid = detail.every((item) => item.materialId && item.qty && item.satuan);
        if (!isDetailValid) {
            res.status(400).json({ error: "Detail material tidak valid" });
            return;
        }
        // ✅ Membuat permintaan lapangan baru
        const newPermintaan = await prisma.permintaanLapangan.create({
            data: {
                nomor,
                tanggal: new Date(tanggal), // Pastikan format tanggal benar
                lokasi,
                picLapangan,
                keterangan,
                detail: {
                    create: detail.map((item) => ({
                        materialId: item.materialId,
                        qty: item.qty,
                        satuan: item.satuan,
                        mention: item.mention || null, // Bisa null jika tidak diisi
                        code: item.code || "", // Default string kosong jika tidak ada
                        keterangan: item.keterangan || null,
                    })),
                },
            },
        });
        res.status(201).json({
            message: "Permintaan lapangan berhasil dibuat",
            data: newPermintaan,
        });
    }
    catch (error) {
        console.error("Error saat membuat permintaan lapangan:", error);
        // ✅ Tangani error Prisma (misalnya duplikasi nomor)
        if (error.code === "P2002") {
            res.status(400).json({ error: "Nomor permintaan sudah ada" });
            return;
        }
        res.status(500).json({ error: "Gagal membuat permintaan lapangan" });
    }
};
exports.createPermintaanLapangan = createPermintaanLapangan;
const getAllPermintaanLapangan = async (req, res) => {
    try {
        const permintaanList = await prisma.permintaanLapangan.findMany({
            include: {
                detail: {
                    include: {
                        material: {
                            include: {
                                vendor: true,
                            },
                        },
                        poDetails: true, // Tambahkan ini untuk cek apakah barang sudah masuk PO
                    },
                },
            },
        });
        // **Filter hanya PL yang masih memiliki barang yang belum masuk PO**
        const filteredPermintaanList = permintaanList
            .map((pl) => ({
            ...pl,
            detail: pl.detail.filter((item) => item.poDetails.length === 0),
        }))
            .filter((pl) => pl.detail.length > 0);
        res.status(200).json(filteredPermintaanList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data permintaan lapangan" });
    }
};
exports.getAllPermintaanLapangan = getAllPermintaanLapangan;
const getPermintaanById = async (req, res) => {
    try {
        const { id } = req.params;
        // Pastikan ID valid
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }
        // Cari permintaan berdasarkan ID
        const permintaan = await prisma.permintaanLapangan.findUnique({
            where: { id: parsedId },
            include: {
                detail: {
                    include: {
                        material: true,
                        poDetails: true, // Tambahkan untuk mengecek apakah sudah masuk PO
                    },
                    where: {
                        poDetails: { none: {} }, // Filter hanya barang yang belum masuk PO
                    },
                },
            },
        });
        if (!permintaan) {
            res.status(404).json({ error: "Permintaan tidak ditemukan" });
            return;
        }
        res.status(200).json(permintaan);
    }
    catch (error) {
        console.error("Error fetching permintaan by ID:", error);
        res.status(500).json({ error: "Gagal mengambil permintaan lapangan" });
    }
};
exports.getPermintaanById = getPermintaanById;
const updateStatusPermintaan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedPermintaan = await prisma.permintaanLapangan.update({
            where: { id: Number(id) },
            data: { status },
        });
        res.status(200).json(updatedPermintaan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengupdate status permintaan' });
    }
};
exports.updateStatusPermintaan = updateStatusPermintaan;
const deletePermintaanLapangan = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.permintaanLapangan.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: 'Permintaan lapangan berhasil dihapus' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menghapus permintaan lapangan' });
    }
};
exports.deletePermintaanLapangan = deletePermintaanLapangan;
const editPermintaanLapangan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomor, tanggal, lokasi, picLapangan, status, isConfirmed, isReceived, keterangan, detail } = req.body;
        // Pastikan permintaan ada di database
        const existingPermintaan = await prisma.permintaanLapangan.findUnique({
            where: { id: Number(id) },
        });
        if (!existingPermintaan) {
            res.status(404).json({ error: "Permintaan tidak ditemukan" });
            return;
        }
        // Update permintaan utama
        await prisma.permintaanLapangan.update({
            where: { id: Number(id) },
            data: {
                nomor,
                tanggal: new Date(tanggal),
                lokasi,
                picLapangan,
                status,
                isConfirmed,
                isReceived,
                keterangan,
            },
        });
        // Jika ada detail baru, update juga
        if (detail && Array.isArray(detail)) {
            await Promise.all(detail.map((item) => prisma.permintaanDetails.upsert({
                where: { id: item.id || 0 }, // Jika ID ada, update, jika tidak, buat baru
                update: {
                    materialId: item.materialId,
                    qty: item.qty,
                    satuan: item.satuan,
                    mention: item.mention,
                    code: item.code,
                },
                create: {
                    permintaanId: Number(id),
                    materialId: item.materialId,
                    qty: item.qty,
                    satuan: item.satuan,
                    mention: item.mention,
                    code: item.code,
                },
            })));
        }
        res.status(200).json({ message: "Permintaan berhasil diperbarui" });
    }
    catch (error) {
        console.error("Gagal memperbarui permintaan lapangan:", error);
        res.status(500).json({ error: "Gagal memperbarui permintaan lapangan" });
    }
};
exports.editPermintaanLapangan = editPermintaanLapangan;
