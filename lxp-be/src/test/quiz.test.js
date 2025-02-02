import { prismaClient } from "../application/database";
import {
  createMeeting,
  createQuiz,
  createTestInstructor,
  createTestUser,
  createTraining,
  createTrainingUser,
  getTestUser,
  removeTestInstructor,
  removeTestUser,
} from "./test.util";
import supertest from "supertest";
import { web } from "../application/web.js";

describe("POST /api/meetings/:meetingId/quizzes", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestInstructor();

    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });

    const training = await createTraining(instructor.id);
    await createMeeting(training.id);
  });

  afterEach(async () => {
    await prismaClient.quiz.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
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
    await createTestUser();
    await createTestInstructor();
    const instructor = await prismaClient.user.findFirst({
      where: { email: "instructor@test.com" },
    });
    const training = await createTraining(instructor.id);
    const meeting = await createMeeting(training.id);

    // Create quiz with 5 questions
    await prismaClient.quiz.create({
      data: {
        meetingId: meeting.id,
        title: "Test Quiz",
        quizScore: 0,
        questions: [
          {
            question: "Question 1?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 0,
          },
          {
            question: "Question 2?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 1,
          },
          {
            question: "Question 3?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 2,
          },
          {
            question: "Question 4?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 1,
          },
          {
            question: "Question 5?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 3,
          },
        ],
      },
    });

    const user = await getTestUser();
    await createTrainingUser(training.id, user.id);
  });

  afterEach(async () => {
    await prismaClient.quiz.deleteMany({});
    await prismaClient.meeting.deleteMany({});
    await prismaClient.training_Users.deleteMany({});
    await prismaClient.training.deleteMany({});
    await removeTestUser();
    await removeTestInstructor();
  });

  it("should get perfect score (100) when all answers are correct", async () => {
    const quiz = await prismaClient.quiz.findFirst({
      where: { title: "Test Quiz" },
    });

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
      });

    console.log("Perfect Score Test:", result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.score).toBe(100);
    expect(result.body.data.totalQuestions).toBe(5);
  });

  it("should throw error if quiz not found", async () => {
    const result = await supertest(web)
      .post(`/api/quizzes/99999/submit`)
      .set("Authorization", "Bearer test")
      .send({
        answers: [{ questionIndex: 0, selectedAnswer: 0 }],
      });

    expect(result.status).toBe(404);
  });
});
