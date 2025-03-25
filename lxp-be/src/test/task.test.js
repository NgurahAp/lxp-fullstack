import { prismaClient } from "../application/database";
import supertest from "supertest";
import { web } from "../application/web.js";
import path from "path";
import fs from "fs";
import {
  createInitScore,
  createMeeting,
  createTask,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  removeAll,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";

describe("POST /api/meetings/:meetingId/tasks", () => {
  beforeEach(async () => {
    await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createMeeting(training.id);
  });

  afterEach(async () => {
    await removeAll();
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

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Test Task");
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

describe("POST /api/tasks/:taskId/submit", () => {
  beforeEach(async () => {
    // Create test directories
    const taskDir = path.join(process.cwd(), "public", "tasks");
    const testPdfDir = path.join(__dirname, "files");

    // Create directories if they don't exist
    [taskDir, testPdfDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create test PDF file if it doesn't exist
    const testPdfPath = path.join(testPdfDir, "test.pdf");
    if (!fs.existsSync(testPdfPath)) {
      fs.writeFileSync(testPdfPath, "Test PDF content");
    }

    const testTxtPath = path.join(testPdfDir, "test.txt");
    if (!fs.existsSync(testTxtPath)) {
      fs.writeFileSync(testTxtPath, "Test TXT content");
    }

    // Setup test data
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createTask(meeting.id);
  });

  afterEach(async () => {
    // Clean up uploaded files
    const taskDir = path.join(process.cwd(), "public", "tasks");
    if (fs.existsSync(taskDir)) {
      const files = fs.readdirSync(taskDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(taskDir, file));
      });
    }

    // Clean up test data in correct order
    await removeAll();
  });

  it("Should submit task answer successfully", async () => {
    // Get the task
    const task = await prismaClient.task.findFirst({
      where: { title: "Test Task" },
    });

    const testPdfPath = path.join(__dirname, "files", "test.pdf");

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/submit`)
      .set("Authorization", "Bearer test")
      .attach("taskAnswer", testPdfPath);

    expect(result.status).toBe(200);
    expect(result.body.data.task.id).toBe(task.id);
    expect(result.body.data.answer).toBeDefined();
    expect(result.body.data.answer).toMatch(/^tasks\/.+.pdf$/);
  });

  it("Should reject non-PDF files", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test Task" },
    });

    const testTxtPath = path.join(__dirname, "files", "test.txt");

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/submit`)
      .set("Authorization", "Bearer test")
      .attach("taskAnswer", testTxtPath);

    expect(result.status).toBe(400);
  });

  it("Should reject if no file is uploaded", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test Task" },
    });

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/submit`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(400);
  });
});

describe("GET /api/meetings/:meetingId/tasks/:taskId", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createTask(meeting.id);
  });

  afterEach(async () => {
    // Clean up uploaded files
    const taskDir = path.join(process.cwd(), "public", "tasks");
    if (fs.existsSync(taskDir)) {
      const files = fs.readdirSync(taskDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(taskDir, file));
      });
    }

    // Clean up test data in correct order
    await removeAll();
  });

  it("Should get task detail successfully", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/tasks/${task.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(task.id);
    expect(result.body.data.title).toBe(task.title);
    expect(result.body.data.submission).toBeDefined();
    expect(result.body.data.submission.score).toBeDefined();
  });

  it("Should reject if user is not enrolled", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    const task = await createTask(meeting.id);

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/tasks/${task.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });
});

describe("POST /api/tasks/:taskId/score", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    const trainingUser = await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createTask(meeting.id);

    // Initialize score for the user
    await createInitScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should submit task score and update score table successfully", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 90,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.taskScore).toBe(90);

    // Verify score table was updated
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: task.meetingId,
      },
    });

    expect(score.taskScore).toBe(90);
    expect(score.totalScore).toBe(30); // Since quiz and task scores are 0
  });

  it("Should update total score correctly when other scores exist", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    // First set some quiz and task scores
    await prismaClient.score.updateMany({
      where: {
        meetingId: task.meetingId,
      },
      data: {
        quizScore: 90,
        moduleScore: 90,
        totalScore: 60,
      },
    });

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 90,
      });

    expect(result.status).toBe(200);

    // Verify total score includes all components
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: task.meetingId,
      },
    });

    expect(score.taskScore).toBe(90);
    expect(score.totalScore).toBe(90); // (90 + 90 + 90) / 3
  });
});
