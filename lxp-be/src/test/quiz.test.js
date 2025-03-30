import { prismaClient } from "../application/database";
import {
  createMeeting,
  createQuiz,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  getTestUser,
  removeAll,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";
import supertest from "supertest";
import { web } from "../application/web.js";

describe("POST /api/meetings/:meetingId/quizzes", () => {
  beforeEach(async () => {
    await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createMeeting(training.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should create new quiz", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const result = await supertest(web)
      .post(`/api/meetings/${meeting.id}/quizzes`)
      .set("Authorization", "Bearer test-instructor")
      .send({
        title: "Test Quiz",
        questions: [
          {
            question: "Berapakah hasil dari 3 x 4?",
            options: ["8", "12", "15", "16"],
            correctAnswer: 1, // index 1 = "12"
          },
          {
            question: "Manakah bilangan prima?",
            options: ["4", "9", "15", "17"],
            correctAnswer: 3, // index 3 = "17"
          },
          {
            question: "Hasil dari akar kuadrat 25?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2, // index 2 = "5"
          },
        ],
      });

    console.log("Error", result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Test Quiz");
    expect(result.body.data.questions).toHaveLength(3);
  });
});

describe("POST /api/quizzes/:quizId/submit", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    await createQuiz(meeting.id);
    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should get perfect score (100) when all answers are correct", async () => {
    const quiz = await prismaClient.quiz.findFirst({
      where: { title: "Test Quiz" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/quizzes/${quiz.id}/submit`)
      .set("Authorization", "Bearer test")
      .send({
        answers: [
          { questionIndex: 0, selectedAnswer: 0 }, // correct
          { questionIndex: 1, selectedAnswer: 1 }, // correct
          { questionIndex: 2, selectedAnswer: 2 }, // correct
          { questionIndex: 3, selectedAnswer: 1 }, // correct
          { questionIndex: 4, selectedAnswer: 3 }, // correct
        ],
        trainingUserId: trainingUser.id,
      });

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.submission.score).toBe(100);

    // Verify score table was updated
    const score = await prismaClient.score.findFirst({
      where: {
        meetingId: quiz.meetingId,
      },
    });

    expect(score.quizScore).toBe(100);
  });

  it("should get perfect score (80) when student dont not mengisi semuanya", async () => {
    const quiz = await prismaClient.quiz.findFirst({
      where: { title: "Test Quiz" },
    });

    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/quizzes/${quiz.id}/submit`)
      .set("Authorization", "Bearer test")
      .send({
        answers: [
          { questionIndex: 0, selectedAnswer: 0 }, // correct
          { questionIndex: 1, selectedAnswer: 1 }, // correct
          { questionIndex: 2, selectedAnswer: 2 }, // correct
          { questionIndex: 4, selectedAnswer: 3 }, // correct
        ],
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.submission.score).toBe(80);
  });

  it("should throw error if quiz not found", async () => {
    const trainingUser = await prismaClient.training_Users.findFirst();

    const result = await supertest(web)
      .post(`/api/quizzes/9999/submit`)
      .set("Authorization", "Bearer test")
      .send({
        answers: [
          { questionIndex: 0, selectedAnswer: 0 }, // correct
          { questionIndex: 1, selectedAnswer: 1 }, // correct
          { questionIndex: 2, selectedAnswer: 2 }, // correct
          { questionIndex: 3, selectedAnswer: 1 }, // correct
          { questionIndex: 4, selectedAnswer: 3 }, // correct
        ],
        trainingUserId: trainingUser.id,
      });

    expect(result.status).toBe(404);
  });
});

describe("GET /api/meetings/:meetingId/quizzes/:quizId", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createQuiz(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should get quiz detail successfully", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const quiz = await prismaClient.quiz.findFirst({
      where: { title: "Test quiz" },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/quizzes/${quiz.id}`)
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(quiz.id);
    expect(result.body.data.title).toBe(quiz.title);
  });

  it("Should reject if user is not enrolled", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    const quiz = await createQuiz(meeting.id);

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/modules/${quiz.id}`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/meetings/:meetingId/quizzes/:quizId/questions", () => {
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    const training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    const meeting = await createMeeting(training.id);
    await createQuiz(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should get quiz questions successfully", async () => {
    const meeting = await prismaClient.meeting.findFirst({
      where: { title: "Test Meeting" },
    });

    const quiz = await prismaClient.quiz.findFirst({
      where: { title: "Test Quiz" },
    });

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/quizzes/${quiz.id}/questions`)
      .set("Authorization", "Bearer test");

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.questions).toBeDefined();
    expect(result.body.data.questions[0].correctAnswer).toBeUndefined();
    expect(result.body.data.questions[0].options).toBeDefined();
  });

  it("Should reject if user is not enrolled", async () => {
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);
    const quiz = await createQuiz(meeting.id);

    const result = await supertest(web)
      .get(`/api/meetings/${meeting.id}/quizzes/${quiz.id}/questions`)
      .set("Authorization", "Bearer test");

    expect(result.status).toBe(403);
  });
});

describe("PUT /api/trainings/:trainingId/meetings/:meetingId/quizes/:quizId", () => {
  let training;
  let meeting;
  let quiz;
  beforeEach(async () => {
    const user = await createTestUser();
    const instructor = await createTestInstructor();
    training = await createTraining(instructor.id);
    await createTrainingUser(training.id, user.id);
    meeting = await createMeeting(training.id);
    quiz = await createQuiz(meeting.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("Should can update quiz", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/quizes/${quiz.id}`
      )
      .set("Authorization", "Bearer test-instructor")
      .set("Content-Type", "application/json")
      .send({
        title: "Update Quiz",
        questions: [
          {
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            correctAnswer: 0,
            score: 10,
          },
        ],
      });

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("Update Quiz");
  });

  it("Should can update quiz", async () => {
    const result = await supertest(web)
      .put(
        `/api/trainings/${training.id}/meetings/${meeting.id}/quizes/${quiz.id}`
      )
      .set("Authorization", "Bearer test")
      .send({
        title: "Update Quiz",
        questions: [
          {
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            correctAnswer: 0,
            score: 10,
          },
        ],
      });

    expect(result.status).toBe(403);
  });
});
