import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      email: "test@gmail.com",
      password: await bcrypt.hash("password", 10),
      name: "test",
      token: "test",
    },
  });
};

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

const createTestInstructor = async () => {
  await prismaClient.user.create({
    data: {
      name: "test instructor",
      email: "instructor@test.com",
      password: await bcrypt.hash("hashedpassword", 10),
      role: "instructor",
      token: "test-instructor",
    },
  });
};

const removeTestInstructor = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "instructor@test.com",
    },
  });
};

// New Training User utilities
const createTrainingUser = async (trainingId, userId) => {
  return prismaClient.training_Users.create({
    data: {
      trainingId: trainingId,
      userId: userId,
      status: "enrolled",
    },
  });
};

const removeTrainingUser = async () => {
  // First remove scores as they depend on training_users
  await removeScore();
  await prismaClient.training_Users.deleteMany();
};

// Training utilities
const createTraining = async (instructorId) => {
  return prismaClient.training.create({
    data: {
      title: "test training",
      description: "test description",
      instructorId: instructorId,
    },
  });
};

const removeTraining = async () => {
  // First remove all dependent records
  await removeMeeting();
  await removeTrainingUser();
  // Then remove training
  await prismaClient.training.deleteMany();
};

// New Meeting utilities
const createMeeting = async (trainingId) => {
  return prismaClient.meeting.create({
    data: {
      trainingId: trainingId,
      title: "Test Meeting",
      meetingDate: new Date(),
    },
  });
};

const removeMeeting = async () => {
  // First remove all related records
  await removeScore();
  await removeModule();
  await removeQuiz();
  await removeTask();
  // Then remove meetings
  await prismaClient.meeting.deleteMany();
};

// New Module utilities
const createModule = async (meetingId) => {
  return prismaClient.module.create({
    data: {
      meetingId: meetingId,
      title: "Test Module",
      content: "modules/test.pdf",
      moduleScore: 100,
    },
  });
};

const removeModule = async () => {
  await prismaClient.module.deleteMany({});
};

const createQuiz = async (meetingId) => {
  return prismaClient.quiz.create({
    data: {
      meetingId: meetingId,
      title: "Test Quiz",
      quizScore: 100,
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
};

const removeQuiz = async () => {
  await prismaClient.quiz.deleteMany({});
};

const createTask = async (meetingId) => {
  return prismaClient.task.create({
    data: {
      meetingId: meetingId,
      title: "Test Task",
      taskQuestion: "Sebutkan 5 rukun islam",
    },
  });
};

const removeTask = async () => {
  await prismaClient.task.deleteMany({});
};

const createScore = async (trainingUserId, meetingId) => {
  await prismaClient.score.create({
    data: {
      trainingUserId: trainingUserId,
      meetingId: meetingId,
      moduleScore: 85,
      quizScore: 90,
      taskScore: 95,
      totalScore: 270,
    },
  });
};

const removeScore = async () => {
  await prismaClient.score.deleteMany({});
};

// Cleanup utility
// Main cleanup utility
const removeAll = async () => {
  await removeScore();
  await removeModule();
  await removeQuiz();
  await removeTask();
  await removeMeeting();
  await removeTrainingUser();
  await removeTraining();
  await removeTestUser();
  await removeTestInstructor();
};

export {
  removeTestUser,
  createTestUser,
  createTestInstructor,
  removeTestInstructor,
  getTestUser,
  createTraining,
  removeTraining,
  createMeeting,
  removeMeeting,
  createModule,
  removeModule,
  createTrainingUser,
  removeTrainingUser,
  removeAll,
  createQuiz,
  removeQuiz,
  createTask,
  createScore,
};
