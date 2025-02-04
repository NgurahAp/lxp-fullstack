import { prismaClient } from "../application/database";
import supertest from "supertest";
import { web } from "../application/web.js";
import path from "path";
import fs from "fs";
import {
  createMeeting,
  createTask,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";

describe("POST /api/meetings/:meetingId/tasks", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    await createTraining(instructor.id);

    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    await prismaClient.meeting.create({
      data: {
        trainingId: training.id,
        title: "Test Meeting",
      },
    });
  });

  afterEach(async () => {
    await prismaClient.task.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
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

    console.log("Error response:", result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Test Task");
    expect(result.body.data.taskScore).toBe(0);
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
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await createTraining(instructor.id);

    const user = await prismaClient.user.findFirst({
      where: { email: "test@gmail.com" },
    });
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
    await prismaClient.score.deleteMany({});
    await prismaClient.task.deleteMany({});
    await prismaClient.quiz.deleteMany({});
    await prismaClient.module.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("Should submit task answer successfully", async () => {
    // Get the task
    const task = await prismaClient.task.findFirst({
      where: { title: "Test Task" },
    });

    if (!task) {
      throw new Error("Test task not found");
    }

    const testPdfPath = path.join(__dirname, "files", "test.pdf");

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/submit`)
      .set("Authorization", "Bearer test")
      .attach("taskAnswer", testPdfPath);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(task.id);
    expect(result.body.data.taskAnswer).toBeDefined();
    expect(result.body.data.taskAnswer).toMatch(/^tasks\/.+.pdf$/);
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

    console.log(result.body);
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
