import { messageStore, studentStore, taskStore } from "../store.js";
import type { ActionCenterResponse } from "../types/index.js";
import { computeUrgencyLevel } from "./urgency.js";

export function getActionCenter(studentId: string): ActionCenterResponse | null {
    const student = studentStore.find((s) => s.id === studentId);
    if (!student) {
        return null;
    }

    const tasks = taskStore.filter((t) => t.studentId === studentId);
    const unreadMessageCount = messageStore.filter(
        (m) => m.studentId === studentId && !m.read,
    ).length;

    return {
        student,
        tasks,
        unreadMessageCount,
        urgencyLevel: computeUrgencyLevel(student, tasks),
    };
}
