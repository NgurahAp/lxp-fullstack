import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";

// Existing user utilities
const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

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
  await prismaClient.training.deleteMany({
    where: {
      title: "test training",
    },
  });
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
  await prismaClient.meeting.deleteMany({
    where: {
      title: "Test Meeting",
    },
  });
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
  await prismaClient.module.deleteMany({
    where: {
      title: "Test Module",
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
  await prismaClient.training_Users.deleteMany({});
};

// Cleanup utility
const removeAll = async () => {
  await removeModule();
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
};
