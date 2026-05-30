import type { TaskPriority, UrgencyLevel } from "../types";

type BadgeVariant = UrgencyLevel | TaskPriority | "enrollment-at-risk" | "enrollment-active";

const LABELS: Record<BadgeVariant, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    urgent: "Urgent",
    "enrollment-at-risk": "At Risk",
    "enrollment-active": "Active",
};

interface BadgeProps {
    variant: BadgeVariant;
}

export function Badge({ variant }: BadgeProps) {
    return <span className={`badge badge--${variant}`}>{LABELS[variant]}</span>;
}
