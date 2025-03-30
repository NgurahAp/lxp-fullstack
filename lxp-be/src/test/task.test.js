import { prismaClient } from "../application/database";
import supertest from "supertest";
import { web } from "../application/web.js";
import path from "path";
import fs from "fs";
import {
  createInitScore,
  createMeeting,
  createTask,
  createTaskSubmission,
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
    const task = await createTask(meeting.id);
    await createTaskSubmission(task.id, trainingUser.id);

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

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 90,
        trainingUserId: trainingUser.id,
      });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.updatedSubmission).toBeDefined();
    expect(result.body.data.updatedSubmission.score).toBe(90);
    expect(result.body.data.updatedSubmission.trainingUserId).toBe(
      trainingUser.id
    );

    // Verify score table was updated
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: task.meetingId,
      },
    });

    expect(score.taskScore).toBe(90);
    expect(score.totalScore).toBe(30); // Since quiz and task scores are 0
  });

  it("Should reject if trainingUserId is missing", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });
    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 90,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject if score is not number", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: "test",
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject if module score is out of range (0-100)", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 2000,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject invalid module ID", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/tasks/invalid-task/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 80,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(404);
  });

  it("Should reject if user submission doesn't exist", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const result = await supertest(web)
      .post(`/api/tasks/${task.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        taskScore: 80,
        trainingUserId: "non-existent-training-user-id",
      });

    expect(result.status).toBe(404);
  });

  it("Should update total score correctly when other scores exist", async () => {
    const task = await prismaClient.task.findFirst({
      where: { title: "Test task" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    // First set some quiz and task scores
    await prismaClient.score.updateMany({
      where: {
        meetingId: task.meetingId,
        trainingUserId: trainingUser.id,
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
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(200);

    // Verify total score includes all components
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: task.meetingId,
        trainingUserId: trainingUser.id,
      },
    });

    expect(score.moduleScore).toBe(90);
    expect(score.quizScore).toBe(90);
    expect(score.taskScore).toBe(90);
    expect(score.totalScore).toBe(90); // (90 + 90 + 90) / 3
  });
});

describe("PUT /api/trainings/:trainingId/meetings/:meetingId/tasks/:taskId", () => {
  let instructor;
  let training;
  let meeting;
  let task;

  beforeEach(async () => {
    const user = await createTestUser();
    instructor = await createTestInstructor();
    training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    meeting = await createMeeting(training.id);
    task = await createTask(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can update task", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/tasks/${task.id}`
      )
      .set("Authorization", "Bearer test-instructor")
      .send({
        title: "Test Task Update",
        taskQuestion: "Sebutkan 5",
      });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Test Task Update");
    expect(result.body.data.taskQuestion).toBe("Sebutkan 5");
  });

  it("Should reject deletion if user is not the instructor", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/tasks/${task.id}`
      )
      .set("Authorization", "Bearer test")
      .send({
        title: "Test Task Update",
        taskQuestion: "Sebutkan 5",
      });

    console.log(result.body);

    expect(result.status).toBe(403);
  });

  it("Should reject deletion for non-existent task", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/tasks/task-not-exist`
      )
      .set("Authorization", "Bearer test-instructor")
      .send({
        title: "Test Task Update",
        taskQuestion: "Sebutkan 5",
      });

    console.log(result.body);

    expect(result.status).toBe(404);
  });
});
