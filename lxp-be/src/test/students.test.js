import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestUser,
  createTestInstructor,
  createTraining,
  createTrainingUser,
  createMeeting,
  createModule,
  createQuiz,
  createTask,
  createModuleSubmission,
  createQuizSubmission,
  createTaskSubmission,
  removeAll,
} from "./test.util.js";
import { prismaClient } from "../application/database.js";

describe("GET /api/instructorStudents", () => {
  let instructor;
  let user1;
  let user2;
  let training1;
  let training2;
  let meeting1;
  let trainingUser1;
  let trainingUser2;
  let module1;
  let quiz1;
  let task1;

  beforeEach(async () => {
    // Create test users and instructor
    instructor = await createTestInstructor();
    user1 = await createTestUser("test1@gmail.com");
    user2 = await createTestUser("test2@gmail.com");

    // Create trainings by the instructor
    training1 = await createTraining(instructor.id);
    training2 = await createTraining(instructor.id);

    // Create a meeting for the first training
    meeting1 = await createMeeting(training1.id);

    // Create learning materials
    module1 = await createModule(meeting1.id);
    quiz1 = await createQuiz(meeting1.id);
    task1 = await createTask(meeting1.id);

    // Enroll users in trainings with different statuses
    trainingUser1 = await createTrainingUser(training1.id, user1.id);
    trainingUser2 = await createTrainingUser(training2.id, user2.id);

    // Set one user as completed
    await prismaClient.training_Users.update({
      where: { id: trainingUser2.id },
      data: { status: "completed" },
    });

    // Create some sample submissions for testing pending assignments
    await createModuleSubmission(module1.id, trainingUser1.id);
    await createQuizSubmission(quiz1.id, trainingUser1.id);
    await createTaskSubmission(task1.id, trainingUser1.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should return 200 and students data for instructor", async () => {
    const result = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", `Bearer test-instructor`);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.students).toBeDefined();
    expect(Array.isArray(result.body.data.students)).toBe(true);
    expect(result.body.data.students.length).toBe(2);
    expect(result.body.paging).toBeDefined();
    expect(result.body.paging.page).toBe(1);

    // Check first student data - with pending assignments
    const student1 = result.body.data.students[0];
    expect(student1.name).toBe("test");
    expect(student1.email).toBe("test1@gmail.com");
    expect(student1.enrolledCourses).toBe(1);
    expect(student1.completedCourses).toBe(0);
    expect(student1.pendingAssignments).toBe(3); // 1 module, 1 quiz, 1 task
    expect(student1.status).toBe("enrolled");
    expect(student1.lastActive).toBeDefined();

    // Check second student data - completed status
    const student2 = result.body.data.students[1];
    expect(student2.name).toBe("test");
    expect(student2.email).toBe("test2@gmail.com");
    expect(student2.enrolledCourses).toBe(1);
    expect(student2.completedCourses).toBe(1);
    expect(student2.pendingAssignments).toBe(0);
    expect(student2.status).toBe("completed");
    expect(student2.lastActive).toBeDefined();
  });

  it("should filter students by status", async () => {
    const result = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", `Bearer test-instructor`)
      .query({
        status: "completed",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.students.length).toBe(1);
    expect(result.body.data.students[0].status).toBe("completed");
    expect(result.body.data.students[0].email).toBe("test2@gmail.com");
  });

  it("should paginate results correctly", async () => {
    // Create a third user for pagination testing
    const user3 = await createTestUser("test3@gmail.com");
    await createTrainingUser(training1.id, user3.id);

    // Test first page with size=1
    const page1 = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", `Bearer test-instructor`)
      .query({
        page: 1,
        size: 1,
      });

    expect(page1.status).toBe(200);
    expect(page1.body.data.students.length).toBe(1);
    expect(page1.body.paging.total_pages).toBe(3);
    expect(page1.body.paging.page).toBe(1);

    // Test second page with size=1
    const page2 = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", `Bearer test-instructor`)
      .query({
        page: 2,
        size: 1,
      });

    expect(page2.status).toBe(200);
    expect(page2.body.data.students.length).toBe(1);
    expect(page2.body.paging.page).toBe(2);

    // Ensure we're getting different students on different pages
    expect(page1.body.data.students[0].id).not.toBe(
      page2.body.data.students[0].id
    );
  });

  it("should return 403 if student tries to access", async () => {
    const result = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", `Bearer test`);

    expect(result.status).toBe(403);
  });

  it("Should reject invalid pagination parameters", async () => {
    const result = await supertest(web)
      .get("/api/instructorStudents")
      .set("Authorization", "Bearer test-instructor")
      .query({
        page: 0,
        size: 101,
      });

    expect(result.status).toBe(400);
  });
});

describe("GET /api/instructorStudents/:studentId", () => {
  let instructor;
  let user;
  let training;
  let meeting;
  let trainingUser;
  let module;
  let quiz;
  let task;

  beforeEach(async () => {
    // Create test users and instructor
    instructor = await createTestInstructor();
    user = await createTestUser();

    // Create trainings by the instructor
    training = await createTraining(instructor.id);

    // Create a meeting for the first training
    meeting = await createMeeting(training.id);

    // Create learning materials
    module = await createModule(meeting.id);
    quiz = await createQuiz(meeting.id);
    task = await createTask(meeting.id);

    // Enroll users in trainings with different statuses
    trainingUser = await createTrainingUser(training.id, user.id);

    // Set one user as completed
    await prismaClient.training_Users.update({
      where: { id: trainingUser.id },
      data: { status: "completed" },
    });

    // Create some sample submissions for testing pending assignments
    await createModuleSubmission(module.id, trainingUser.id);
    await createQuizSubmission(quiz.id, trainingUser.id);
    await createTaskSubmission(task.id, trainingUser.id);
  });

  afterEach(async () => {
    await removeAll();
  });

  it("should return 200 and students data for instructor", async () => {
    const result = await supertest(web)
      .get(`/api/instructorStudents/${user.id}`)
      .set("Authorization", `Bearer test-instructor`);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.profile).toBeDefined();
    expect(Array.isArray(result.body.data.modules)).toBe(true);
    expect(Array.isArray(result.body.data.quizzes)).toBe(true);
    expect(Array.isArray(result.body.data.tasks)).toBe(true);
  });

  it("should return 404 if student not found", async () => {
    const result = await supertest(web)
      .get(`/api/instructorStudents/invalid-student-id`)
      .set("Authorization", `Bearer test-instructor`);

    expect(result.status).toBe(404);
  });

  it("should return 403 if not the instructor", async () => {
    const result = await supertest(web)
      .get(`/api/instructorStudents/${user.id}`)
      .set("Authorization", `Bearer test`);

    console.log(result.body);

    expect(result.status).toBe(403);
  });
});
