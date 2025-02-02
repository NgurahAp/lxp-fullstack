import { prismaClient } from "../application/database";
import {
  createMeeting,
  createTestInstructor,
  createTestUser,
  createTraining,
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
