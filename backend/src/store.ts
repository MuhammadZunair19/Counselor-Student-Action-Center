import { students, tasks as initialTasks, messages } from "./data/mock-data.js";
import type { Student, Task, Message } from "./types/index.js";

export const studentStore: Student[] = [...students];
export const taskStore: Task[] = initialTasks.map((task) => ({ ...task }));
export const messageStore: Message[] = [...messages];

export function resetStores(): void {
    studentStore.length = 0;
    studentStore.push(...students.map((student) => ({ ...student })));

    taskStore.length = 0;
    taskStore.push(...initialTasks.map((task) => ({ ...task })));

    messageStore.length = 0;
    messageStore.push(...messages.map((message) => ({ ...message })));
}
