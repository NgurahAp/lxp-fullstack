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

const createTestInstructor = async () => {
  await prismaClient.user.create({
    data: {
      name: "test instructor",
      email: "instructor@test.com",
      password: "hashedpassword",
      role: "instructor",
      token: "test",
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


export { removeTestUser, createTestUser, createTestInstructor, removeTestInstructor };
