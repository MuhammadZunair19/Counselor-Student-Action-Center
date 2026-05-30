import { Router } from "express";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { isValidTaskStatus, updateTaskStatus } from "../services/tasks.js";

const router = Router();

router.patch(
    "/:taskId/status",
    asyncHandler(async (req, res) => {
        const { status } = req.body;

        if (!isValidTaskStatus(status)) {
            throw new AppError(
                400,
                "Invalid status. Must be one of: todo, in_progress, completed",
            );
        }

        const updatedTask = updateTaskStatus(req.params.taskId, status);

        if (!updatedTask) {
            throw new AppError(404, "Task not found");
        }

        res.json(updatedTask);
    }),
);

export default router;
