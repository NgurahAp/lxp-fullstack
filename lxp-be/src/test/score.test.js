import supertest from "supertest";
import { prismaClient } from "../application/database.js";
import { web } from "../application/web.js";
import {
  createMeeting,
  createModule,
  createScore,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  removeAll,
  removeScore,
} from "./test.util.js";

describe("GET /api/meetings/:meetingId/scores", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await createTraining(instructor.id);

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });
    const trainingUser = await createTrainingUser(training.id, user.id);

    const meeting = await createMeeting(training.id);
    await createModule(meeting.id);

    await createScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should get score successfully", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/scores`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data.moduleScore).toBe(85);
    expect(result.body.data.quizScore).toBe(90);
    expect(result.body.data.taskScore).toBe(95);
    expect(result.body.data.totalScore).toBe(270);
    expect(result.body.data.meeting).toBeDefined();
    expect(result.body.data.meeting.training).toBeDefined();
  });

  it("should return 404 when meeting not found", async () => {
    const result = await supertest(web)
      .get("/api/meetings/99999/scores")
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });

  it("should return 404 when user not enrolled", async () => {
    // Create a new training with meeting but without enrollment
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/scores`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });

  it("should return 401 when unauthorized", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web).get(
      `/api/meetings/${meeting.id}/scores`
    );

    expect(result.status).toBe(401);
  });

  it("should return 400 when meeting id is invalid", async () => {
    const result = await supertest(web)
      .get("/api/meetings/invalid/scores")
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(400);
  });

  it("should get score with zero values for new enrollment", async () => {
    // Create new training and enrollment
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });
    const trainingUser = await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);

    // Create score with zero values
    await prismaClient.score.create({
      data: {
        trainingUserId: trainingUser.id,
        meetingId: meeting.id,
        moduleScore: 0,
        quizScore: 0,
        taskScore: 0,
        totalScore: 0,
      },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/scores`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data.moduleScore).toBe(0);
    expect(result.body.data.quizScore).toBe(0);
    expect(result.body.data.taskScore).toBe(0);
    expect(result.body.data.totalScore).toBe(0);
  });
});

describe("GET /api/trainings/:trainingId/scores", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await createTraining(instructor.id);

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });
    const trainingUser = await createTrainingUser(training.id, user.id);

    // Create multiple meetings with scores
    const meeting1 = await createMeeting(training.id);
    const meeting2 = await createMeeting(training.id);

    await createScore(trainingUser.id, meeting1.id);
    await createScore(trainingUser.id, meeting2.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should get all meeting scores for a training successfully", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "Test Training" },
    });

    const result = await supertest(web)
      .get(`/api/trainings/${training.id}/scores`)
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
  });

  it("should return 404 when training not found", async () => {
    const result = await supertest(web)
      .get("/api/trainings/99999/scores")
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });

  it("should return 404 when user not enrolled", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);

    const result = await supertest(web)
      .get(`/api/trainings/${training.id}/scores`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });

  it("should return 401 when unauthorized", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "Test Training" },
    });

    const result = await supertest(web).get(
      `/api/trainings/${training.id}/scores`
    );

    expect(result.status).toBe(401);
  });
});
