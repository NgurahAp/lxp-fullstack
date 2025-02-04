import supertest from "supertest";
import { prismaClient } from "../application/database";
import { web } from "../application/web";
import { logger } from "../application/logging";
import {
  createTestInstructor,
  createTestUser,
  createTraining,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";
import path from "path";
import fs from "fs";

describe("POST /api/trainings", () => {
  beforeEach(async () => {
    // Create test directories
    const trainingDir = path.join(process.cwd(), "public", "trainings");
    if (!fs.existsSync(trainingDir)) {
      fs.mkdirSync(trainingDir, { recursive: true });
    }

    await createTestUser();
    await createTestInstructor();
  });

  afterEach(async () => {
    // Clean up uploaded files
    const trainingDir = path.join(process.cwd(), "public", "trainings");
    if (fs.existsSync(trainingDir)) {
      const files = fs.readdirSync(trainingDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(trainingDir, file));
      });
    }

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

  it("Should create new training with image", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    // Create a test image
    const testImagePath = path.join(__dirname, "files", "test.jpg");
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, "Test image content");
    }

    const result = await supertest(web)
      .post("/api/trainings")
      .set("Authorization", "Bearer test-instructor")
      .field("title", "test training")
      .field("description", "test description")
      .field("instructorId", instructor.id)
      .attach("image", testImagePath);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("test training");
    expect(result.body.data.image).toBeDefined();
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

describe("GET /api/students/trainings", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    // Create a test training
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    await createTraining(instructor.id);

    // Enroll test user in training
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    await prismaClient.training_Users.create({
      data: {
        trainingId: training.id,
        userId: user.id,
      },
    });
  });

  afterEach(async () => {
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("Should return students training with pagination", async () => {
    const result = await supertest(web)
      .get("/api/student/trainings")
      .set("Authorization", "Bearer test")
      .query({ page: 1, size: 10 });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(Array.isArray(result.body.data)).toBe(true);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.page).toBe(1);
    expect(result.body.data[0].training.title).toBe("test training");
  });

  it("Should filter trainings by status", async () => {
    const result = await supertest(web)
      .get("/api/student/trainings")
      .set("Authorization", "Bearer test")
      .query({
        status: "enrolled",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data[0].status).toBe("enrolled");
  });

  it("Should reject invalid pagination parameters", async () => {
    const result = await supertest(web)
      .get("/api/student/trainings")
      .set("Authorization", "Bearer test")
      .query({
        page: 0,
        size: 100,
      });

    expect(result.status).toBe(400);
  });
});

describe("GET /api/student/trainings/:trainingId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    // Create a test training
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    await createTraining(instructor.id);

    // Enroll test user in training
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });

    await prismaClient.training_Users.create({
      data: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Create test meeting
    await prismaClient.meeting.create({
      data: {
        trainingId: training.id,
        title: "Test Meeting",
        meetingDate: new Date(),
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

  it("Should return training detail with meetings", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .get(`/api/student/trainings/${training.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("test training");
    expect(Array.isArray(result.body.data.meetings)).toBe(true);
    expect(result.body.data.meetings.length).toBe(1);
    expect(result.body.data.meetings[0].title).toBe("Test Meeting");
  });

  it("Should reject when accessing unauthorized training", async () => {
    const result = await supertest(web)
      .get(`/api/student/trainings/99999`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(403);
  });
});
