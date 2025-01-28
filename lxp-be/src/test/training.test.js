import supertest from "supertest";
import { prismaClient } from "../application/database";
import { web } from "../application/web";

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
