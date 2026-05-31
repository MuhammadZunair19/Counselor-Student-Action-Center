import { Router } from "express";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getActionCenter } from "../services/action-center.js";

const router = Router();

router.get(
    "/:id/action-center",
    asyncHandler(async (req, res) => {
        const actionCenter = getActionCenter(req.params.id);

        if (!actionCenter) {
            throw new AppError(404, "Student not found");
        }

        res.json(actionCenter);
    }),
);

export default router;
