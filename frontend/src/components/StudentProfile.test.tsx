import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ActionCenterResponse } from "../types";
import { StudentProfile } from "./StudentProfile";

const mockData: ActionCenterResponse = {
    student: {
        id: "stu_001",
        name: "Maya Patel",
        email: "maya.patel@school.edu",
        grade: 11,
        gpa: 3.2,
        counselorId: "csl_001",
        enrollmentStatus: "at_risk",
    },
    tasks: [],
    unreadMessageCount: 2,
    urgencyLevel: "critical",
};

describe("StudentProfile", () => {
    it("renders student summary, urgency badge, and unread message count", () => {
        render(<StudentProfile data={mockData} />);

        expect(screen.getByRole("heading", { name: "Maya Patel" })).toBeInTheDocument();
        expect(screen.getByText("maya.patel@school.edu")).toBeInTheDocument();
        expect(screen.getByText("Critical")).toBeInTheDocument();
        expect(screen.getByText("At Risk")).toBeInTheDocument();
        expect(screen.getByText("11")).toBeInTheDocument();
        expect(screen.getByText("3.2")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("highlights unread count when messages are unread", () => {
        const { container } = render(<StudentProfile data={mockData} />);

        const unreadCount = screen.getByText("2");
        expect(unreadCount).toHaveClass("stat-highlight");
        expect(container.querySelector(".stat-highlight")).toBeTruthy();
    });
});
