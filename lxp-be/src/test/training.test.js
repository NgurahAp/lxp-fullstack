import supertest from "supertest";
import { prismaClient } from "../application/database";
import { web } from "../application/web";
import {
  createMeeting,
  createModule,
  createModuleSubmission,
  createQuiz,
  createQuizSubmission,
  createScore,
  createTask,
  createTaskSubmission,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  getTestInstructor,
  removeAll,
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

    await removeAll();
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

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("test training");
    expect(result.body.data.image).toBeDefined();
  });
});

describe("POST /api/training-users", () => {
  let user;
  beforeEach(async () => {
    user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    await createModule(meeting.id);
    await createQuiz(meeting.id);
    await createTask(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should reject enrollment if user already enrolled", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    // First enrollment
    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Second attempt should fail
    const result = await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBe("User already enrolled in this training");
  });

  it("Should create a training user record when student joins training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.trainingId).toBe(training.id);
    expect(result.body.data.userId).toBe(user.id);
    expect(result.body.data.status).toBe("enrolled");

    // Verify a training_user record was created
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });
    expect(trainingUser).not.toBeNull();
  });

  it("Should automatically create module submissions when student joins training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Get the training user record
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Get module records for this training
    const meeting = await prismaClient.meeting.findFirst({
      where: { trainingId: training.id },
    });

    const module = await prismaClient.module.findFirst({
      where: { meetingId: meeting.id },
    });

    // Verify module submission was created
    const moduleSubmission = await prismaClient.moduleSubmission.findFirst({
      where: {
        moduleId: module.id,
        trainingUserId: trainingUser.id,
      },
    });

    expect(moduleSubmission).not.toBeNull();
    expect(moduleSubmission.score).toBe(0);
  });

  it("Should automatically create quiz submissions when student joins training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Get the training user record
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Get quiz records for this training
    const meeting = await prismaClient.meeting.findFirst({
      where: { trainingId: training.id },
    });

    const quiz = await prismaClient.quiz.findFirst({
      where: { meetingId: meeting.id },
    });

    // Verify quiz submission was created
    const quizSubmission = await prismaClient.quizSubmission.findFirst({
      where: {
        quizId: quiz.id,
        trainingUserId: trainingUser.id,
      },
    });

    expect(quizSubmission).not.toBeNull();
    expect(quizSubmission.score).toBe(0);
  });

  it("Should automatically create task submissions when student joins training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Get the training user record
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Get task records for this training
    const meeting = await prismaClient.meeting.findFirst({
      where: { trainingId: training.id },
    });

    const task = await prismaClient.task.findFirst({
      where: { meetingId: meeting.id },
    });

    // Verify task submission was created
    const taskSubmission = await prismaClient.taskSubmission.findFirst({
      where: {
        taskId: task.id,
        trainingUserId: trainingUser.id,
      },
    });

    expect(taskSubmission).not.toBeNull();
    expect(taskSubmission.score).toBe(0);
  });

  it("Should automatically create score records when student joins training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Get the training user record
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Get meeting for this training
    const meeting = await prismaClient.meeting.findFirst({
      where: { trainingId: training.id },
    });

    // Verify score record was created
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: meeting.id,
        trainingUserId: trainingUser.id,
      },
    });

    expect(score).not.toBeNull();
    expect(score.moduleScore).toBe(0);
    expect(score.quizScore).toBe(0);
    expect(score.taskScore).toBe(0);
    expect(score.totalScore).toBe(0);
  });

  it("Should handle multiple meetings with their components correctly", async () => {
    // Create a second meeting with components
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });
    const meeting2 = await createMeeting(training.id);
    await createModule(meeting2.id);
    await createQuiz(meeting2.id);
    await createTask(meeting2.id);

    await supertest(web)
      .post("/api/training-users")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
      });

    // Get the training user record
    const trainingUser = await prismaClient.training_Users.findFirst({
      where: {
        trainingId: training.id,
        userId: user.id,
      },
    });

    // Count all created submissions
    const moduleSubmissions = await prismaClient.moduleSubmission.count({
      where: { trainingUserId: trainingUser.id },
    });

    const quizSubmissions = await prismaClient.quizSubmission.count({
      where: { trainingUserId: trainingUser.id },
    });

    const taskSubmissions = await prismaClient.taskSubmission.count({
      where: { trainingUserId: trainingUser.id },
    });

    const scores = await prismaClient.score.count({
      where: { trainingUserId: trainingUser.id },
    });

    // We should have 2 of each since we have 2 meetings
    expect(moduleSubmissions).toBe(2);
    expect(quizSubmissions).toBe(2);
    expect(taskSubmissions).toBe(2);
    expect(scores).toBe(2);
  });
});

describe("GET /api/students/trainings", () => {
  beforeEach(async () => {
    const user = await createTestUser();

    const instructor = await createTestInstructor();

    const training = await createTraining(instructor.id);

    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
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

describe("GET /api/instructor/trainings", () => {
  beforeEach(async () => {
    const user = await createTestUser();

    const instructor = await createTestInstructor();

    const training = await createTraining(instructor.id);

    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should return 200 and instructor dashboard data", async () => {
    const result = await supertest(web)
      .get("/api/instructor/trainings")
      .set("Authorization", `Bearer test-instructor`);

    console.log(result.body.data.training);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(Array.isArray(result.body.data.training)).toBe(true);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.page).toBe(1);
    expect(result.body.data.training[0].title).toBe("test training");
  });

  it("should return 403 if student try to access", async () => {
    const result = await supertest(web)
      .get("/api/instructor/trainings")
      .set("Authorization", `Bearer test`);

    expect(result.status).toBe(403);
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
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    await createMeeting(training.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should reject when accessing unauthorized training", async () => {
    const result = await supertest(web)
      .get(`/api/student/trainings/99999`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(403);
  });
});

describe("GET /api/instructor/trainings/:trainingId", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    await createMeeting(training.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should return training detail with meetings", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .get(`/api/instructor/trainings/${training.id}`)
      .set("Authorization", "Bearer test-instructor");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("Should reject if student try to access", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .get(`/api/instructor/trainings/${training.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(403);
  });
});

describe("PUT /api/instructor/updateTraining/:trainingId", () => {
  beforeEach(async () => {
    // Create test directories
    const trainingDir = path.join(process.cwd(), "public", "trainings");
    if (!fs.existsSync(trainingDir)) {
      fs.mkdirSync(trainingDir, { recursive: true });
    }

    await createTestUser();
    const instructor = await createTestInstructor();
    await createTraining(instructor.id);
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

    await removeAll();
  });

  it("It Should can update training", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const instructor = await getTestInstructor();

    // Create a test image
    const testImagePath = path.join(__dirname, "files", "test.jpg");
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, "Test image content");
    }

    const result = await supertest(web)
      .put("/api/instructor/updateTraining/" + training.id)
      .set("Authorization", "Bearer test-instructor")
      .field("title", "test update training")
      .field("description", "test update description")
      .field("instructorId", instructor.id)
      .attach("image", testImagePath);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("test update training");
    expect(result.body.data.description).toBe("test update description");
    expect(result.body.data.image).toBeDefined();
  });
});

describe("DELETE /api/instructor/deleteTraining/:trainingId", () => {
  let training;
  let instructor;
  let user;
  let meeting;

  beforeEach(async () => {
    instructor = await createTestInstructor();
    user = await createTestUser();
    training = await createTraining(instructor.id);
    const trainingUser = await createTrainingUser(training.id, user.id);
    meeting = await createMeeting(training.id);

    const module = await createModule(meeting.id);
    const quiz = await createQuiz(meeting.id);
    const task = await createTask(meeting.id);

    await createModuleSubmission(module.id, trainingUser.id);
    await createQuizSubmission(quiz.id, trainingUser.id);
    await createTaskSubmission(task.id, trainingUser.id);

    await createScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can delete training", async () => {
    const result = await supertest(web)
      .delete(`/api/instructor/deleteTraining/${training.id}`)
      .set("Authorization", "Bearer test-instructor");

    expect(result.status).toBe(200);

    // Verify training is deleted
    const deletedTraining = await prismaClient.training.findUnique({
      where: { id: training.id },
    });
    expect(deletedTraining).toBeNull();

    // Verify related records are also deleted
    const relatedTrainingUsers = await prismaClient.training_Users.findMany({
      where: { trainingId: training.id },
    });
    expect(relatedTrainingUsers).toHaveLength(0);

    const relatedMeetings = await prismaClient.meeting.findMany({
      where: { trainingId: training.id },
    });
    expect(relatedMeetings).toHaveLength(0);

    // Verify submissions are deleted
    const moduleSubmissions = await prismaClient.moduleSubmission.findMany({
      where: { trainingUser: { trainingId: training.id } },
    });
    expect(moduleSubmissions).toHaveLength(0);

    const quizSubmissions = await prismaClient.quizSubmission.findMany({
      where: { trainingUser: { trainingId: training.id } },
    });
    expect(quizSubmissions).toHaveLength(0);

    const taskSubmissions = await prismaClient.taskSubmission.findMany({
      where: { trainingUser: { trainingId: training.id } },
    });
    expect(taskSubmissions).toHaveLength(0);

    const scores = await prismaClient.score.findMany({
      where: { trainingUser: { trainingId: training.id } },
    });
    expect(scores).toHaveLength(0);
  });
});
