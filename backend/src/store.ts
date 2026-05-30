import { students, tasks as initialTasks, messages } from "./data/mock-data.js";
import type { Student, Task, Message } from "./types/index.js";

export const studentStore: Student[] = [...students];
export const taskStore: Task[] = initialTasks.map((task) => ({ ...task }));
export const messageStore: Message[] = [...messages];
