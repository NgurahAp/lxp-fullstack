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
    // Create test instructor
    await createTestInstructor();
    await createTestUser(); // Add test user for enrollment

    // Get instructor
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    // Get test user
    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    // Create training and enroll the user
    const training = await prismaClient.training.create({
      data: {
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
        users: {
          create: {
            userId: user.id,
            status: "enrolled",
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prismaClient.score.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
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

  it("should automatically create score records for enrolled users", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
      include: { users: true },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 2",
        meetingDate: "2024-02-02T10:00:00Z",
      });

    expect(result.status).toBe(200);

    // Get the newly created meeting
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Meeting 2" },
    });

    // Check if score records were created
    const scores = await prismaClient.score.findMany({
      where: { meetingId: meeting.id },
    });

    expect(scores.length).toBe(training.users.length);

    // Verify initial score values
    scores.forEach((score) => {
      expect(score.moduleScore).toBe(0);
      expect(score.quizScore).toBe(0);
      expect(score.taskScore).toBe(0);
      expect(score.totalScore).toBe(0);
    });
  });

  it("should reject meeting creation for non-instructor", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
        title: "Unauthorized Meeting",
        meetingDate: "2024-02-03T10:00:00Z",
      });

    expect(result.status).toBe(403);
  });

  it("should handle meeting creation with no enrolled users", async () => {
    // Remove existing enrolled users
    await prismaClient.training_Users.deleteMany({
      where: { training: { title: "test training" } },
    });

    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 3",
        meetingDate: "2024-02-04T10:00:00Z",
      });

    expect(result.status).toBe(200);

    // Verify no score records were created
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Meeting 3" },
    });

    const scores = await prismaClient.score.findMany({
      where: { meetingId: meeting.id },
    });

    expect(scores.length).toBe(0);
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
