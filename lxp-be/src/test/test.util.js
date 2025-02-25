import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";

const createTestUser = async () => {
  return prismaClient.user.create({
    data: {
      email: "test@gmail.com",
      password: await bcrypt.hash("password", 10),
      name: "test",
      token: "test",
      resetToken: "test",
      resetTokenExpiration: new Date(Date.now() + 3600000),
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
  await prismaClient.user.deleteMany({});
};

const createTestInstructor = async () => {
  return prismaClient.user.create({
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
  return prismaClient.user.deleteMany({
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
  return prismaClient.training_Users.deleteMany();
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
  return prismaClient.training.deleteMany();
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
  return prismaClient.meeting.deleteMany();
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
  return prismaClient.module.deleteMany({});
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
  return prismaClient.quiz.deleteMany({});
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
  return prismaClient.task.deleteMany({});
};

const createInitScore = async (trainingUserId, meetingId) => {
  return prismaClient.score.create({
    data: {
      trainingUserId: trainingUserId,
      meetingId: meetingId,
      moduleScore: 0,
      quizScore: 0,
      taskScore: 0,
      totalScore: 0,
    },
  });
};

const createScore = async (trainingUserId, meetingId) => {
  return prismaClient.score.create({
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
  return prismaClient.score.deleteMany({});
};

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
  createInitScore,
};
