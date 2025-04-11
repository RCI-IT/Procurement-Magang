import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createCO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { permintaanId, note, details } = req.body

    const confirmationOrder = await prisma.confirmationOrder.create({
      data: {
        permintaanId,
        note,
        details: {
          create: details.map((item: any) => ({
            permintaanDetailId: item.permintaanDetailId,
            statusDetail: item.statusDetail,
            note: item.note,
          })),
        },
      },
      include: {
        details: true,
      },
    })

    res.status(201).json({
      message: 'Confirmation Order berhasil dibuat',
      data: confirmationOrder,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getAllCO = async (req: Request, res: Response): Promise<void> => {
  try {
    const confirmationOrders = await prisma.confirmationOrder.findMany({
      include: {
        permintaan: true,
        details: {
          include: {
            permintaanDetail: true,
          },
        },
      },
    })

    res.status(200).json({
      data: confirmationOrders,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getCOById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const confirmationOrder = await prisma.confirmationOrder.findUnique({
      where: { id: Number(id) },
      include: {
        permintaan: true,
        details: {
          include: {
            permintaanDetail: true,
          },
        },
      },
    })

    if (!confirmationOrder) {
      res.status(404).json({ message: 'Confirmation Order tidak ditemukan' })
      return
    }

    res.status(200).json({
      message: 'Berhasil mengambil data Confirmation Order',
      data: confirmationOrder,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const updateCO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { note, details } = req.body

    const confirmationOrder = await prisma.confirmationOrder.update({
      where: { id: Number(id) },
      data: { note },
    })

    await Promise.all(
      details.map((item: any) =>
        prisma.confirmationDetails.update({
          where: { id: item.id },
          data: {
            statusDetail: item.statusDetail,
            note: item.note,
          },
        })
      )
    )

    res.status(200).json({
      message: 'Confirmation Order berhasil diupdate',
      data: confirmationOrder,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteCO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await prisma.confirmationDetails.deleteMany({
      where: { confirmationOrderId: Number(id) },
    })

    await prisma.confirmationOrder.delete({
      where: { id: Number(id) },
    })

    res.status(200).json({
      message: 'Confirmation Order berhasil dihapus',
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Handler Error
const handleError = (res: Response, error: unknown): void => {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message })
  } else {
    res.status(500).json({ message: 'Terjadi kesalahan' })
  }
}
