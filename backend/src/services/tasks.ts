import { taskStore } from "../store.js";
import type { Task, TaskStatus } from "../types/index.js";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

export function isValidTaskStatus(status: unknown): status is TaskStatus {
    return typeof status === "string" && VALID_STATUSES.includes(status as TaskStatus);
}

export function updateTaskStatus(taskId: string, status: TaskStatus): Task | null {
    const taskIndex = taskStore.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        return null;
    }

    const updatedTask: Task = {
        ...taskStore[taskIndex],
        status,
        updatedAt: new Date().toISOString(),
    };

    taskStore[taskIndex] = updatedTask;
    return updatedTask;
}
