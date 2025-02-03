import { prismaClient } from "../application/database";
import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestInstructor,
  createTestUser,
  createTraining,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";

describe("POST /api/meetings/:meetingId/tasks", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    await createTraining(instructor.id);

    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await prismaClient.meeting.create({
      data: {
        trainingId: training.id,
        title: "Test Meeting",
        meetingDate: new Date(),
      },
    });
  });

  afterEach(async () => {
    await prismaClient.task.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("Should create new task", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/tasks`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        title: "Test Task",
        taskQuestion: "Sebutkan 5 rukun islam",
      });

    console.log("Error response:", result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Test Task");
    expect(result.body.data.taskScore).toBe(0);
  });

  it("Should reject if user role not Instructor", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/tasks`)
      .set("Authorization", "Bearer test")
      .send({
        title: "Test Task",
        taskQuestion: "Sebutkan 5 rukun islam",
      });

    expect(result.status).toBe(403);
  });
});
