import type { Task, TaskStatus } from "../types";
import { Badge } from "./Badge";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: "todo", label: "To do" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
];

function formatDueDate(dueDate: string): string {
    return new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function isOverdue(task: Task): boolean {
    if (task.status === "completed") return false;
    const today = new Date().toISOString().slice(0, 10);
    return task.dueDate < today;
}

interface TaskItemProps {
    task: Task;
    disabled: boolean;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskItem({ task, disabled, onStatusChange }: TaskItemProps) {
    const overdue = isOverdue(task);

    return (
        <li className={`task-item task-item--${task.status}`}>
            <div className="task-item__main">
                <div className="task-item__title-row">
                    <h3>{task.title}</h3>
                    <Badge variant={task.priority} />
                </div>
                <p className="task-item__description">{task.description}</p>
                <p className={`task-item__due ${overdue ? "task-item__due--overdue" : ""}`}>
                    Due {formatDueDate(task.dueDate)}
                    {overdue && " · Overdue"}
                </p>
            </div>

            <label className="task-item__status">
                <span className="sr-only">Status for {task.title}</span>
                <select
                    value={task.status}
                    disabled={disabled}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        </li>
    );
}
