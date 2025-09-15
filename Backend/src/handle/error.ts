import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export function handleBadRequestResponse(res: Response, message: string): void {
    res.status(StatusCodes.BAD_REQUEST).json({ message })
}

export function handleValidationFailureResponse(res: Response, message: string): void {
    res.status(StatusCodes.BAD_REQUEST).json({ message })
}

export function handleUnauthorizedResponse(res: Response, message: string): void {
    res.status(StatusCodes.UNAUTHORIZED).json({ message })
}

export function handleForbiddenResponse(res: Response, message: string): void {
    res.status(StatusCodes.FORBIDDEN).json({ message })
}

export function handleNotFoundResponse(res: Response, message: string): void {
    res.status(StatusCodes.NOT_FOUND).json({ message })
}

export function handleMethodNotAllowedResponse(res: Response, method: string): void {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        message: `Method ${method} not allowed`,
    })
}

export function handleConflictResponse(res: Response, message: string): void {
    res.status(StatusCodes.CONFLICT).json({ message })
}

export function handleUnprocessableEntityResponse(res: Response, message: string): void {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message })
}

export function handleServerError(res: Response, message: string): void {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Internal server error: ${message}` })
}

export const handleDatabaseError = (res: Response, err: any, errorMessage: string) => {
    if (err && err.code === 'P1000' && err.message.includes('5432')) {
        return handleServerError(res, 'Unable to connect to the database server. Please try again later.');
    } else {
        console.error('Error creating material:', errorMessage);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
};

export function handleLoggingError(err: Error): void {
    console.error('An error occurred:', err)
}