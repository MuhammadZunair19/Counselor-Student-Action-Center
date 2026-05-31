import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { resetStores } from "../../src/store.js";

const app = createApp();

describe("Action Center API (integration)", () => {
    beforeEach(() => {
        resetStores();
    });

    afterEach(() => {
        resetStores();
    });

    it("returns action center payload for a valid student with request ID", async () => {
        const response = await request(app).get("/students/stu_001/action-center").expect(200);

        expect(response.headers["x-request-id"]).toBeDefined();
        expect(response.body.student.id).toBe("stu_001");
        expect(response.body.student.name).toBe("Maya Patel");
        expect(response.body.tasks.length).toBeGreaterThan(0);
        expect(response.body.unreadMessageCount).toBe(2);
        expect(response.body.urgencyLevel).toBe("critical");
    });

    it("updates task status and reflects change on subsequent fetch", async () => {
        const patchResponse = await request(app)
            .patch("/tasks/tsk_001/status")
            .send({ status: "in_progress" })
            .expect(200);

        expect(patchResponse.headers["x-request-id"]).toBeDefined();
        expect(patchResponse.body.status).toBe("in_progress");
        expect(patchResponse.body.updatedAt).toBeDefined();

        const actionCenter = await request(app)
            .get("/students/stu_001/action-center")
            .expect(200);

        const updatedTask = actionCenter.body.tasks.find(
            (task: { id: string }) => task.id === "tsk_001",
        );
        expect(updatedTask.status).toBe("in_progress");
    });

    it("returns 404 with requestId for unknown student", async () => {
        const response = await request(app)
            .get("/students/stu_unknown/action-center")
            .expect(404);

        expect(response.headers["x-request-id"]).toBeDefined();
        expect(response.body).toEqual({
            error: "Student not found",
            requestId: response.headers["x-request-id"],
        });
    });

    it("returns 400 with requestId for invalid task status", async () => {
        const response = await request(app)
            .patch("/tasks/tsk_001/status")
            .send({ status: "invalid" })
            .expect(400);

        expect(response.body.requestId).toBe(response.headers["x-request-id"]);
        expect(response.body.error).toContain("Invalid status");
    });

    it("propagates client-provided X-Request-Id header", async () => {
        const clientRequestId = "client-req-abc-123";

        const response = await request(app)
            .get("/health")
            .set("X-Request-Id", clientRequestId)
            .expect(200);

        expect(response.headers["x-request-id"]).toBe(clientRequestId);
        expect(response.body.requestId).toBe(clientRequestId);
    });
});
