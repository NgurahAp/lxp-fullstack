import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";

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

export {
  removeTestUser,
  createTestUser,
  createTestInstructor,
  removeTestInstructor,
  getTestUser,
};
