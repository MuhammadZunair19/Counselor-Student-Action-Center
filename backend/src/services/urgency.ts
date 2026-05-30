import type { Student, Task, UrgencyLevel } from "../types/index.js";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
};

function isOpenTask(task: Task): boolean {
    return task.status !== "completed";
}

function isOverdue(task: Task, today: string): boolean {
    return isOpenTask(task) && task.dueDate < today;
}

export function computeUrgencyLevel(student: Student, studentTasks: Task[]): UrgencyLevel {
    const today = new Date().toISOString().slice(0, 10);
    const openTasks = studentTasks.filter(isOpenTask);
    const urgentOpen = openTasks.filter((t) => t.priority === "urgent");
    const overdueOpen = openTasks.filter((t) => isOverdue(t, today));

    const priorityScore = openTasks.reduce(
        (sum, task) => sum + PRIORITY_WEIGHT[task.priority],
        0,
    );

    if (
        (student.enrollmentStatus === "at_risk" && urgentOpen.length > 0) ||
        urgentOpen.length >= 2 ||
        overdueOpen.length >= 2
    ) {
        return "critical";
    }

    if (urgentOpen.length > 0 || overdueOpen.length > 0 || priorityScore >= 6) {
        return "high";
    }

    if (openTasks.length > 0) {
        return "medium";
    }

    return "low";
}
