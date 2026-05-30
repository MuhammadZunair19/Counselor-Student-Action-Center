import type { ActionCenterResponse, Task, TaskStatus } from "../types";

const API_BASE = "/api";

async function parseError(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as { error?: string };
        return body.error ?? `Request failed (${response.status})`;
    } catch {
        return `Request failed (${response.status})`;
    }
}

export async function fetchActionCenter(studentId: string): Promise<ActionCenterResponse> {
    const response = await fetch(`${API_BASE}/students/${studentId}/action-center`);

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    return response.json() as Promise<ActionCenterResponse>;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    return response.json() as Promise<Task>;
}
