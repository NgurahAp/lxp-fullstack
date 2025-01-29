import supertest from "supertest";
import { prismaClient } from "../application/database";
import { web } from "../application/web";
import { logger } from "../application/logging";
import {
  createTestInstructor,
  createTestUser,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";

describe("POST /api/trainings", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();
  });

  afterEach(async () => {
    await prismaClient.training_Users.deleteMany({
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

    await removeTestUser();
    await removeTestInstructor();
  });

  it("Should create new training", async () => {
    // Mengambil data instruktor
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const result = await supertest(web)
      .post("/api/trainings")
      .set("Authorization", `Bearer test-instructor`) // Add 'Bearer' prefix
      .send({
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("test training");
  });

  it("Should reject when non-instructor tries to create training", async () => {
    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    const result = await supertest(web)
      .post("/api/trainings")
      .set("Authorization", "Bearer test")
      .send({
        title: "test training",
        description: "test description",
        instructorId: user.id,
      });

    expect(result.status).toBe(403);
  });

  it("should reject invalid training user data", async () => {
    const result = await supertest(web)
      .post("/api/training-users")
      .set("Authorization", `Bearer test`) // Add 'Bearer' prefix
      .send({
        trainingId: 0,
        userId: 0,
      });

    expect(result.status).toBe(400);
  });
});

describe("POST /api/training-users", () => {
  beforeEach(async () => {
    await createTestUser();

    await createTestInstructor();
    const instructor = await prismaClient.user.findFirst({
      where: {
        email: "instructor@test.com",
        role: "instructor",
      },
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
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await prismaClient.user.deleteMany({});
  });

  it("Should reject enrollment if user already enrolled", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
        userId: user.id,
      });

    const result = await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
        userId: user.id,
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("User already enrolled in this training");
  });
});
