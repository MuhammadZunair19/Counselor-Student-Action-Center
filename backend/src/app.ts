import cors from "cors";
import express from "express";
import studentRoutes from "./routes/students.js";
import taskRoutes from "./routes/tasks.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { requestLoggerMiddleware } from "./middleware/requestLogger.js";

export function createApp() {
    const app = express();

    app.use(requestIdMiddleware);
    app.use(requestLoggerMiddleware);
    app.use(cors());
    app.use(express.json());

    app.get("/health", (req, res) => {
        res.json({ status: "ok", requestId: req.requestId });
    });

    app.use("/students", studentRoutes);
    app.use("/tasks", taskRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
