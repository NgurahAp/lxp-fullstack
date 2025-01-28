import supertest from "supertest";
import { prismaClient } from "../application/database";
import { web } from "../application/web";
import { logger } from "../application/logging";

describe("POST /api/trainings", () => {
  beforeEach(async () => {
    await prismaClient.user.create({
      data: {
        name: "test instructor",
        email: "instructor@test.com",
        password: "hashedpassword",
        role: "instructor",
        token: "test",
      },
    });
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

    await prismaClient.user.deleteMany({
      where: {
        email: "instructor@test.com",
      },
    });
  });

  it("Should create new training", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const result = await supertest(web)
      .post("/api/trainings")
      .set("Authorization", `Bearer test`) // Add 'Bearer' prefix
      .send({
        title: "test training",
        description: "test description",
        instructorId: instructor.id,
      });

    console.log(result.body); // Add this for debugging
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("test training");
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
    await prismaClient.user.create({
      data: {
        name: "test user",
        email: "user@test.com",
        password: "hashedpassword",
        role: "student",
        token: "test", // Tambahkan token untuk testing
      },
    });

    const instructor = await prismaClient.user.create({
      data: {
        name: "test instructor",
        email: "instructor@test.com",
        password: "hashedpassword",
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
      where: { email: "user@test.com" },
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
