import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log error ke console
    console.error("Error:", err.message);

    // Tentukan status code, default ke 500 jika tidak ada
    const statusCode = err.statusCode || 500;

    // Format respons JSON
    res.status(statusCode).json({
        error: err.name || "ServerError", // Nama error, jika tersedia
        message: err.message || "Something went wrong", // Pesan error
        details: err.details || null, // Detail tambahan jika ada
    });
};
