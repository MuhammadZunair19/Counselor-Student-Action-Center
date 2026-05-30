import cors from "cors";
import express from "express";
import studentRoutes from "./routes/students.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/students", studentRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
