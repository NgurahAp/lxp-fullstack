import supertest from "supertest";
import { prismaClient } from "../application/database.js";
import { web } from "../application/web.js";
import path from "path";
import fs from "fs";
import {
  createInitScore,
  createMeeting,
  createModule,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  getTestInstructor,
  createModuleSubmission,
  removeAll,
  createScore,
} from "./test.util.js";

describe("POST /api/meetings/:meetingId/modules", () => {
  beforeEach(async () => {
    // Create test directories if they don't exist
    const moduleDir = path.join(process.cwd(), "public", "modules");
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Create test PDF file
    const testPdfDir = path.join(__dirname, "files");
    if (!fs.existsSync(testPdfDir)) {
      fs.mkdirSync(testPdfDir, { recursive: true });
    }

    const testPdfPath = path.join(testPdfDir, "test.pdf");
    if (!fs.existsSync(testPdfPath)) {
      // Create a simple PDF file for testing
      fs.writeFileSync(testPdfPath, "Test PDF content");
    }

    // Create a non-PDF file for testing
    const testTxtPath = path.join(testPdfDir, "test.txt");
    if (!fs.existsSync(testTxtPath)) {
      fs.writeFileSync(testTxtPath, "Test TXT content");
    }

    const instructor = await createTestInstructor();

    const training = await createTraining(instructor.id);

    await createMeeting(training.id);
  });

  afterEach(async () => {
    const moduleDir = path.join(process.cwd(), "public", "modules");

    if (fs.existsSync(moduleDir)) {
      const files = fs.readdirSync(moduleDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(moduleDir, file));
      });
    }

    await removeAll();
  });

  it("Should create new module", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const testPdfPath = path.join(__dirname, "files", "test.pdf");

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/modules`)
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Test Module")
      .attach("content", testPdfPath);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("Test Module");
    expect(result.body.data.content).toBeDefined();
    expect(result.body.data.content).toMatch(/^modules\/.+.pdf$/);
  });

  it("Should reject non-PDF files", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const testTxtPath = path.join(__dirname, "files", "test.txt");

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/modules`)
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Test Module")
      .field("moduleScore", "100") // Convert to string
      .attach("content", testTxtPath);

    expect(result.status).toBe(400);
  });

  it("Should reject if no file is uploaded", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/modules`)
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Test Module")
      .field("moduleScore", "100"); // Convert to string

    expect(result.status).toBe(400);
  });
});

describe("POST /api/modules/:moduleId/answer", () => {
  beforeEach(async () => {
    // Create test user and instructor
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createModule(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should submit module answer successfully", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/answer`)
      .set("Authorization", "Bearer test")
      .send({
        answer: "This is my answer to the module",
      });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.answer).toBe("This is my answer to the module");

    // Verify that a submission was created in the database
    const submission = await prismaClient.moduleSubmission.findFirst({
      where: {
        moduleId: module.id,
      },
    });

    expect(submission).not.toBeNull();
    expect(submission.answer).toBe("This is my answer to the module");
  });

  it("Should update existing submission when submitting again", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    // First submission
    await supertest(web)
      .post(`/api/modules/${module.id}/answer`)
      .set("Authorization", "Bearer test")
      .send({
        answer: "First answer",
      });

    // Second submission
    const result = await supertest(web)
      .post(`/api/modules/${module.id}/answer`)
      .set("Authorization", "Bearer test")
      .send({
        answer: "Updated answer",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.answer).toBe("Updated answer");

    // Verify we only have one submission in the database
    const submissions = await prismaClient.moduleSubmission.findMany({
      where: {
        moduleId: module.id,
      },
    });

    expect(submissions.length).toBe(1);
    expect(submissions[0].answer).toBe("Updated answer");
  });

  it("Should reject if user is not enrolled", async () => {
    // Create a new training with module but without enrollment
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    const module = await createModule(meeting.id);

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/answer`)
      .set("Authorization", "Bearer test")
      .send({
        answer: "This is my answer to the module",
      });

    expect(result.status).toBe(404);
  });

  it("Should reject invalid module ID", async () => {
    const result = await supertest(web)
      .post(`/api/modules/999999/answer`)
      .set("Authorization", "Bearer test")
      .send({
        answer: "This is my answer to the module",
      });

    expect(result.status).toBe(404);
  });
});

describe("GET /api/meetings/:meetingId/modules/:moduleId", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    const trainingUser = await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    const module = await createModule(meeting.id);

    // Optionally create a module submission for testing
    await prismaClient.moduleSubmission.create({
      data: {
        moduleId: module.id,
        trainingUserId: trainingUser.id,
        answer: "Test answer",
        score: 80,
      },
    });
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should get module detail successfully", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/modules/${module.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(module.id);
    expect(result.body.data.title).toBe(module.title);
    expect(result.body.data.submission).toBeDefined();
    expect(result.body.data.submission.score).toBeDefined();
  });

  it("Should reject if user is not enrolled", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    const module = await createModule(meeting.id);

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/modules/${module.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });
});

describe("POST /api/modules/:moduleId/score", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    const trainingUser = await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    const module = await createModule(meeting.id);
    await createModuleSubmission(module.id, trainingUser.id);

    // Initialize score for the user
    await createInitScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should submit module score for specific user and update score table successfully", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 90,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.updatedSubmission).toBeDefined();
    expect(result.body.data.updatedSubmission.score).toBe(90);
    expect(result.body.data.updatedSubmission.trainingUserId).toBe(
      trainingUser.id
    );

    // Verify module submission was updated
    const moduleSubmission = await prismaClient.moduleSubmission.findFirst({
      where: {
        moduleId: module.id,
        trainingUserId: trainingUser.id,
      },
    });

    expect(moduleSubmission).toBeDefined();
    expect(moduleSubmission.score).toBe(90);

    // Verify score table was updated
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: module.meetingId,
        trainingUserId: trainingUser.id,
      },
    });

    expect(score.moduleScore).toBe(90);
    expect(score.totalScore).toBe(30); // Since quiz and task scores are 0
  });

  it("Should reject if trainingUserId is missing", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 85,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject if module score is not a number", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: "test",
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject if module score is out of range (0-100)", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 101,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(400);
  });

  it("Should reject invalid module ID", async () => {
    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/modules/invalid-module-id/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 80,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe(
      "Module not found or you're not the instructor"
    );
  });

  it("Should reject if user submission doesn't exist", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 85,
        trainingUserId: "non-existent-training-user-id",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe(
      "Module submission not found for this user"
    );
  });

  it("Should update total score correctly when other scores exist", async () => {
    const module = await prismaClient.module.findFirst({
      where: { title: "Test Module" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    // First set some quiz and task scores
    await prismaClient.score.updateMany({
      where: {
        meetingId: module.meetingId,
        trainingUserId: trainingUser.id,
      },
      data: {
        quizScore: 90,
        taskScore: 90,
        totalScore: 60,
      },
    });

    const result = await supertest(web)
      .post(`/api/modules/${module.id}/score`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        moduleScore: 90,
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(200);

    // Verify total score includes all components
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: module.meetingId,
        trainingUserId: trainingUser.id,
      },
    });

    expect(score.moduleScore).toBe(90);
    expect(score.quizScore).toBe(90);
    expect(score.taskScore).toBe(90);
    expect(score.totalScore).toBe(90); // (90 + 90 + 90) / 3
  });
});

describe("PUT /api/trainings/:trainingId/meetings/:meetingId/modules/:moduleId", () => {
  let instructor;
  let training;
  let meeting;
  let module;

  beforeEach(async () => {
    const moduleDir = path.join(process.cwd(), "public", "modules");
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Create test PDF file
    const testPdfDir = path.join(__dirname, "files");
    if (!fs.existsSync(testPdfDir)) {
      fs.mkdirSync(testPdfDir, { recursive: true });
    }

    const testPdfPath = path.join(testPdfDir, "update.pdf");
    if (!fs.existsSync(testPdfPath)) {
      // Create a simple PDF file for testing
      fs.writeFileSync(testPdfPath, "update PDF content");
    }

    // Create a non-PDF file for testing
    const testTxtPath = path.join(testPdfDir, "test.txt");
    if (!fs.existsSync(testTxtPath)) {
      fs.writeFileSync(testTxtPath, "Test TXT content");
    }

    const user = await createTestUser();
    instructor = await createTestInstructor();
    training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    meeting = await createMeeting(training.id);
    module = await createModule(meeting.id);
  });

  afterEach(async () => {
    const moduleDir = path.join(process.cwd(), "public", "modules");

    if (fs.existsSync(moduleDir)) {
      const files = fs.readdirSync(moduleDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(moduleDir, file));
      });
    }
    await removeAll();
  });

  it("Should can update module with both title and file", async () => {
    const testPdfPath = path.join(__dirname, "files", "update.pdf");

    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Update Module")
      .attach("content", testPdfPath);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("Update Module");
    expect(result.body.data.content).toBeDefined();
    expect(result.body.data.content).toMatch(/^modules\/.+.pdf$/);
    // Verify file has changed from the original
    expect(result.body.data.content).not.toBe("modules/test.pdf");
  });

  it("Should can update module title only", async () => {
    const originalContent = module.content; // Save original content

    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Title Only Update");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe("Title Only Update");
    expect(result.body.data.content).toBe(originalContent); // Content should remain unchanged
  });

  it("Should can update module file only", async () => {
    const testPdfPath = path.join(__dirname, "files", "update.pdf");
    const originalTitle = module.title; // Save original title

    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test-instructor")
      .attach("content", testPdfPath);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe(originalTitle); // Title should remain unchanged
    expect(result.body.data.content).toBeDefined();
    expect(result.body.data.content).toMatch(/^modules\/.+.pdf$/);
    expect(result.body.data.content).not.toBe("modules/test.pdf"); // Content should be changed
  });

  it("Should reject update if user is not the instructor", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test") // Using regular user token instead of instructor
      .field("title", "Unauthorized Update");

    expect(result.status).toBe(403);
  });

  it("Should reject update for non-existent module", async () => {
    const nonExistentId = "module-not-exist";

    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${nonExistentId}`
      )
      .set("Authorization", "Bearer test-instructor")
      .field("title", "Update Non-existent");

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/trainings/:trainingId/meetings/:meetingId/modules/:moduleId", () => {
  let instructor;
  let training;
  let meeting;
  let module;
  let trainingUser;

  beforeEach(async () => {
    const moduleDir = path.join(process.cwd(), "public", "modules");
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Create a test file that will be deleted
    const testFilePath = path.join(moduleDir, "test.pdf");
    fs.writeFileSync(testFilePath, "Test content for deletion");

    const user = await createTestUser();
    instructor = await createTestInstructor();
    training = await createTraining(instructor.id);
    trainingUser = await createTrainingUser(training.id, user.id);
    meeting = await createMeeting(training.id);

    // Create module with the test file path
    module = await createModule(meeting.id);

    await createModuleSubmission(module.id, trainingUser.id);
    await createScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    const moduleDir = path.join(process.cwd(), "public", "modules");

    if (fs.existsSync(moduleDir)) {
      const files = fs.readdirSync(moduleDir);
      files.forEach((file) => {
        try {
          fs.unlinkSync(path.join(moduleDir, file));
        } catch (error) {
          // Ignore errors if files are already deleted by tests
        }
      });
    }
    await removeAll();
  });

  it("Should can delete module", async () => {
    const filePath = path.join(process.cwd(), "public", "modules", "test.pdf");
    expect(fs.existsSync(filePath)).toBe(true); // Confirm file exists before deletion

    const result = await supertest(web)
      .delete(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test-instructor");

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();

    // Verify file is actually deleted from filesystem
    expect(fs.existsSync(filePath)).toBe(false);

    // Verify module is deleted from database
    const deletedModule = await prismaClient.module.findUnique({
      where: {
        id: module.id,
      },
    });
    expect(deletedModule).toBeNull();
  });

  it("Should reject deletion if user is not the instructor", async () => {
    const result = await supertest(web)
      .delete(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${module.id}`
      )
      .set("Authorization", "Bearer test"); // Using regular user token

    expect(result.status).toBe(403);

    // Verify module still exists
    const moduleStillExists = await prismaClient.module.findUnique({
      where: {
        id: module.id,
      },
    });
    expect(moduleStillExists).not.toBeNull();
  });

  it("Should reject deletion for non-existent module", async () => {
    const nonExistentId = "module-not-exist";

    const result = await supertest(web)
      .delete(
        `/api/trainings/${training.id}/meetings/${meeting.id}/modules/${nonExistentId}`
      )
      .set("Authorization", "Bearer test-instructor");

    expect(result.status).toBe(404);
  });
});
