import supertest from "supertest";
import { prismaClient } from "../application/database.js";
import { web } from "../application/web.js";
import {
  createTestUser,
  createTestInstructor,
  removeTestUser,
  removeTestInstructor,
} from "./test.util.js";

describe("POST /api/meetings", () => {
  beforeEach(async () => {
    await createTestInstructor();
    // Create test training
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    await prismaClient.training.create({
      data: {
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
      },
    });
  });

  afterEach(async () => {
    await prismaClient.meeting.deleteMany({
      where: {
        training: {
          title: "test training",
        },
      },
    });
    await prismaClient.training.deleteMany({
      where: {
        title: "test training",
      },
    });
    await removeTestInstructor();
  });

  it("should create new meeting", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 1",
        meetingDate: "2024-02-01T10:00:00Z",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Meeting 1");
  });
});

describe("GET /api/trainings/:trainingId/meetings", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    // Create test training and enroll user
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await prismaClient.training.create({
      data: {
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
      },
    });

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    await prismaClient.training_Users.create({
      data: {
        trainingId: training.id,
        userId: user.id,
        status: "enrolled",
      },
    });

    // Create test meeting
    await prismaClient.meeting.create({
      data: {
        trainingId: training.id,
        title: "Test Meeting",
        meetingDate: new Date("2024-02-01T10:00:00Z"),
      },
    });
  });

  afterEach(async () => {
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("should return meetings for enrolled student", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .get(`/api/trainings/${training.id}/meetings`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data[0].title).toBe("Test Meeting");
  });
});

describe("GET /api/trainings/:trainingId/meetings/:meetingId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    // Create test training and enroll user
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await prismaClient.training.create({
      data: {
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
      },
    });

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    await prismaClient.training_Users.create({
      data: {
        trainingId: training.id,
        userId: user.id,
        status: "enrolled",
      },
    });

    // Create test meeting
    await prismaClient.meeting.create({
      data: {
        trainingId: training.id,
        title: "Test Meeting",
        meetingDate: new Date("2024-02-01T10:00:00Z"),
      },
    });
  });

  afterEach(async () => {
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("should return meeting detail for enrolled student", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const meeting = await prismaClient.meeting.findFirst({
      where: { trainingId: training.id },
    });

    const result = await supertest(web)
      .get(`/api/trainings/${training.id}/meetings/${meeting.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("Test Meeting");
  });
});
