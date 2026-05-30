import { Router } from "express";
import { isValidTaskStatus, updateTaskStatus } from "../services/tasks.js";

const router = Router();

router.patch("/:taskId/status", (req, res) => {
    const { status } = req.body;

    if (!isValidTaskStatus(status)) {
        res.status(400).json({
            error: "Invalid status. Must be one of: todo, in_progress, completed",
        });
        return;
    }

    const updatedTask = updateTaskStatus(req.params.taskId, status);

    if (!updatedTask) {
        res.status(404).json({ error: "Task not found" });
        return;
    }

    res.json(updatedTask);
});

export default router;
