export type EnrollmentStatus = "at_risk" | "active";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: number;
    gpa: number;
    counselorId: string;
    enrollmentStatus: EnrollmentStatus;
}

export interface Task {
    id: string;
    studentId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ActionCenterResponse {
    student: Student;
    tasks: Task[];
    unreadMessageCount: number;
    urgencyLevel: UrgencyLevel;
}

export const STUDENT_OPTIONS = [
    { id: "stu_001", label: "Maya Patel" },
    { id: "stu_002", label: "Jordan Lee" },
    { id: "stu_003", label: "Carlos Rivera" },
] as const;
