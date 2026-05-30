import type { Task, TaskStatus } from "../types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
    updatingTaskId: string | null;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const STATUS_ORDER: Record<Task["status"], number> = {
    todo: 0,
    in_progress: 1,
    completed: 2,
};

const PRIORITY_ORDER: Record<Task["priority"], number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
};

function sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
}

export function TaskList({ tasks, updatingTaskId, onStatusChange }: TaskListProps) {
    const sorted = sortTasks(tasks);
    const openCount = tasks.filter((t) => t.status !== "completed").length;

    return (
        <section className="card task-list-card" aria-labelledby="tasks-heading">
            <header className="task-list-card__header">
                <h2 id="tasks-heading">Tasks</h2>
                <span className="task-list-card__count">
                    {openCount} open · {tasks.length} total
                </span>
            </header>

            {sorted.length === 0 ? (
                <p className="empty-message">No tasks for this student.</p>
            ) : (
                <ul className="task-list">
                    {sorted.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            disabled={updatingTaskId === task.id}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}
