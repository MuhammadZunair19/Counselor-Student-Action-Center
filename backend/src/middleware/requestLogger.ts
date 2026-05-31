import type { NextFunction, Request, Response } from "express";

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on("finish", () => {
        const durationMs = Date.now() - start;
        const logEntry = {
            level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
            requestId: req.requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            durationMs,
        };

        console.log(JSON.stringify(logEntry));
    });

    next();
}
