import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const requestId = req.requestId ?? "unknown";

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message, requestId });
        return;
    }

    console.error(
        JSON.stringify({
            level: "error",
            requestId,
            message: err instanceof Error ? err.message : "Unknown error",
            stack: err instanceof Error ? err.stack : undefined,
        }),
    );

    res.status(500).json({
        error: "Internal server error",
        requestId,
    });
}
