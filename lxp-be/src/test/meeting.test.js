import supertest from "supertest";
import { prismaClient } from "../application/database.js";
import { web } from "../application/web.js";
import {
  createTestUser,
  createTestInstructor,
  createTraining,
  createTrainingUser,
  removeAll,
  createMeeting,
  createModule,
  createQuiz,
  createTask,
  createModuleSubmission,
  createQuizSubmission,
  createTaskSubmission,
  createScore,
} from "./test.util.js";

describe("POST /api/meetings", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should create new meeting", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 1",
        meetingDate: "2024-02-01T10:00:00Z",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Meeting 1");
  });

  it("should automatically create score records for enrolled users", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
      include: { users: true },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 2",
        meetingDate: "2024-02-02T10:00:00Z",
      });

    expect(result.status).toBe(200);

    // Get the newly created meeting
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Meeting 2" },
    });

    // Check if score records were created
    const scores = await prismaClient.score.findMany({
      where: { meetingId: meeting.id },
    });

    expect(scores.length).toBe(training.users.length);

    // Verify initial score values
    scores.forEach((score) => {
      expect(score.moduleScore).toBe(0);
      expect(score.quizScore).toBe(0);
      expect(score.taskScore).toBe(0);
      expect(score.totalScore).toBe(0);
    });
  });

  it("should reject meeting creation for non-instructor", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test")
      .send({
        trainingId: training.id,
        title: "Unauthorized Meeting",
        meetingDate: "2024-02-03T10:00:00Z",
      });

    expect(result.status).toBe(403);
  });

  it("should handle meeting creation with no enrolled users", async () => {
    // Remove existing enrolled users
    await prismaClient.training_Users.deleteMany({
      where: { training: { title: "test training" } },
    });

    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .post("/api/meetings")
      .set("Authorization", "Bearer test-instructor")
      .send({
        trainingId: training.id,
        title: "Meeting 3",
        meetingDate: "2024-02-04T10:00:00Z",
      });

    expect(result.status).toBe(200);

    // Verify no score records were created
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Meeting 3" },
    });

    const scores = await prismaClient.score.findMany({
      where: { meetingId: meeting.id },
    });

    expect(scores.length).toBe(0);
  });
});

describe("GET /api/trainings/:trainingId/meetings", () => {
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

  it("should return meetings for enrolled student", async () => {
    const training = await prismaClient.training.findFirst({
      where: { title: "test training" },
    });

    const result = await supertest(web)
      .get(`/api/trainings/${training.id}/meetings`)
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data[0].title).toBe("Test Meeting");
  });
});


describe("PUT /api/trainings/:trainingId/meetings/:meetingId", () => {
  let training;
  let meeting;
  let instructor;

  beforeEach(async () => {
    await createTestUser();
    instructor = await createTestInstructor();
    training = await createTraining(instructor.id);
    meeting = await createMeeting(training.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can update meeting", async () => {
    const result = await supertest(web)
      .put(`/api/trainings/${training.id}/meetings/${meeting.id}`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        title: "Updated Meeting Title",
      });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Updated Meeting Title");
  });

  it("Should reject if not the instructor", async () => {
    const otherInstructor = await createTestInstructor("other@example.com");

    const result = await supertest(web)
      .put(`/api/trainings/${training.id}/meetings/${meeting.id}`)
      .set("Authorization", `Bearer test-instructor-${otherInstructor.id}`)
      .send({
        title: "Updated Meeting Title",
        meetingDate: "2024-02-01T10:00:00Z",
      });

    expect(result.status).toBe(401);
  });
});

describe("DELETE /api/trainings/:trainingId/meetings/:meetingId", () => {
  let training;
  let instructor;
  let user;
  let meeting;
  let module;
  let quiz;
  let task;
  let trainingUser;

  beforeEach(async () => {
    // Create test data
    instructor = await createTestInstructor();
    user = await createTestUser();

    // Create training and associate training user
    training = await createTraining(instructor.id);
    trainingUser = await createTrainingUser(training.id, user.id);

    // Create meeting
    meeting = await createMeeting(training.id);

    // Create related content
    module = await createModule(meeting.id);
    quiz = await createQuiz(meeting.id);
    task = await createTask(meeting.id);

    // Create submissions
    await createModuleSubmission(module.id, trainingUser.id);
    await createQuizSubmission(quiz.id, trainingUser.id);
    await createTaskSubmission(task.id, trainingUser.id);

    // Create score
    await createScore(trainingUser.id, meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should be able to delete meeting", async () => {
    const result = await supertest(web)
      .delete(`/api/trainings/${training.id}/meetings/${meeting.id}`)
      .set("Authorization", "Bearer test-instructor");

    console.log(result.body);

    expect(result.status).toBe(200);

    // Verify meeting is deleted
    const deletedMeeting = await prismaClient.meeting.findUnique({
      where: { id: meeting.id },
    });
    expect(deletedMeeting).toBeNull();

    // Verify related modules are deleted
    const relatedModules = await prismaClient.module.findMany({
      where: { meetingId: meeting.id },
    });
    expect(relatedModules).toHaveLength(0);

    // Verify related quizzes are deleted
    const relatedQuizzes = await prismaClient.quiz.findMany({
      where: { meetingId: meeting.id },
    });
    expect(relatedQuizzes).toHaveLength(0);

    // Verify related tasks are deleted
    const relatedTasks = await prismaClient.task.findMany({
      where: { meetingId: meeting.id },
    });
    expect(relatedTasks).toHaveLength(0);

    // Verify submissions are deleted
    const moduleSubmissions = await prismaClient.moduleSubmission.findMany({
      where: { moduleId: module.id },
    });
    expect(moduleSubmissions).toHaveLength(0);

    const quizSubmissions = await prismaClient.quizSubmission.findMany({
      where: { quizId: quiz.id },
    });
    expect(quizSubmissions).toHaveLength(0);

    const taskSubmissions = await prismaClient.taskSubmission.findMany({
      where: { taskId: task.id },
    });
    expect(taskSubmissions).toHaveLength(0);

    // Verify scores are deleted
    const scores = await prismaClient.score.findMany({
      where: { meetingId: meeting.id },
    });
    expect(scores).toHaveLength(0);
  });

  it("Should reject if meeting does not exist", async () => {
    const nonExistentMeetingId = "non-existent-meeting-id";

    const result = await supertest(web)
      .delete(`/api/trainings/${training.id}/meetings/${nonExistentMeetingId}`)
      .set("Authorization", "Bearer test-instructor");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject if user is not the instructor of the training", async () => {
    const result = await supertest(web)
      .delete(`/api/trainings/${training.id}/meetings/${meeting.id}`)
      .set("Authorization", `Bearer test`);

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject if training does not match meeting", async () => {
    // Create another training
    const anotherTraining = await createTraining(instructor.id);

    const result = await supertest(web)
      .delete(`/api/trainings/${anotherTraining.id}/meetings/${meeting.id}`)
      .set("Authorization", "Bearer test-instructor");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});
