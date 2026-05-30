import { Router } from "express";
import { getActionCenter } from "../services/action-center.js";

const router = Router();

router.get("/:id/action-center", (req, res) => {
    const actionCenter = getActionCenter(req.params.id);

    if (!actionCenter) {
        res.status(404).json({ error: "Student not found" });
        return;
    }

    res.json(actionCenter);
});

export default router;
