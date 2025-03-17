import supertest from "supertest";
import { web } from "../application/web";
import {
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  removeAll,
} from "./test.util";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";

describe("GET /api/dashboard", () => {
  beforeEach(async () => {
    const user = await createTestUser();

    const instructor = await createTestInstructor();

    const training = await createTraining(instructor.id);

    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can get dashboard", async () => {
    const result = await supertest(web)
      .get("/api/dashboard")
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
  });
});

describe("GET /api/instructor/dashboard", () => {
  let instructorData;
  let studentData;
  let instructorToken;
  let studentToken;
  let trainingOne;
  let trainingTwo;
  let trainingUserOne;
  let trainingUserTwo;

  beforeEach(async () => {
    // Membuat test user (instructor dan student)
    instructorData = await createTestInstructor();
    studentData = await createTestUser();

    // Login sebagai instructor untuk mendapatkan token
    const instructorLoginResult = await supertest(web)
      .post("/api/users/login")
      .send({
        email: instructorData.email,
        password: "hashedpassword", // Sesuai dengan createTestInstructor di utils
      });

    instructorToken = instructorLoginResult.body.data.token;

    // Login sebagai student untuk mendapatkan token
    const studentLoginResult = await supertest(web)
      .post("/api/users/login")
      .send({
        email: studentData.email,
        password: "password", // Sesuai dengan createTestUser di utils
      });

    studentToken = studentLoginResult.body.data.token;

    // Membuat training untuk instructor
    trainingOne = await createTraining(instructorData.id);
    // Karena utils createTraining tidak menerima parameter title dan description,
    // kita bisa meng-update training setelah dibuat jika perlu
    await prismaClient.training.update({
      where: { id: trainingOne.id },
      data: {
        title: "NodeJS Course",
        description: "Learn NodeJS",
      },
    });

    trainingTwo = await createTraining(instructorData.id);
    await prismaClient.training.update({
      where: { id: trainingTwo.id },
      data: {
        title: "ReactJS Course",
        description: "Learn ReactJS",
      },
    });

    // Mendaftarkan student ke training
    trainingUserOne = await createTrainingUser(trainingOne.id, studentData.id);
    trainingUserTwo = await createTrainingUser(trainingTwo.id, studentData.id);
  });

  afterEach(async () => {
    // Cleanup data test menggunakan utils yang ada
    await removeAll();
  });

  it("should return 200 and instructor dashboard data", async () => {
    const result = await supertest(web)
      .get("/api/instructor/dashboard")
      .set("Authorization", `Bearer ${instructorToken}`);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.profile).toBeDefined();
    expect(result.body.data.profile.id).toBe(instructorData.id);
    expect(result.body.data.profile.role).toBe("instructor");
    expect(result.body.data.summary).toBeDefined();
    expect(result.body.data.summary.totalCourses).toBe(2);
    expect(result.body.data.summary.totalUniqueStudents).toBe(1);
    expect(result.body.data.courses).toBeDefined();
    expect(result.body.data.courses.length).toBe(2);
  });

  it("should return 403 if not instructor", async () => {
    const result = await supertest(web)
      .get("/api/instructor/dashboard")
      .set("Authorization", `Bearer ${studentToken}`);

    logger.info(result.body);

    expect(result.status).toBe(403);
  });

  it("should return 401 if not logged in", async () => {
    const result = await supertest(web).get("/api/instructor/dashboard");

    logger.info(result.body);

    expect(result.status).toBe(401);
  });
});
