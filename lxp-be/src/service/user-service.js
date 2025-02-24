import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { sendWelcomeEmail } from "./email-service.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(401, "Email already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const createdUser = await prismaClient.user.create({
    data: user,
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  // Send welcome email after successful registration
  await sendWelcomeEmail(createdUser.email, createdUser.name);

  return createdUser;
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const token = uuid().toString();

  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      email: user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      token: true,
      profile: true,
    },
  });
};

const get = async (email) => {
  email = validate(getUserValidation, email);

  // Pengecekan email ke DB
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profile: true,
      trainingUsers: {
        select: {
          training: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
              instructor: true,
              meetings: {
                select: {
                  id: true,
                  scores: {
                    select: {
                      totalScore: true,
                    },
                  },
                },
              },
            },
          },
          id: true,
          status: true,
        },
      },
      _count: {
        select: {
          trainingUsers: true,
        },
      },
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  // Transform data dan hitung average score untuk setiap training
  const trainingsWithScores = user.trainingUsers.map((tu) => {
    let totalScore = 0;
    let meetingsWithScore = 0;

    tu.training.meetings.forEach((meeting) => {
      if (meeting.scores.length > 0) {
        totalScore += meeting.scores[0].totalScore;
        meetingsWithScore++;
      }
    });

    const averageScore =
      meetingsWithScore > 0 ? Math.round(totalScore / meetingsWithScore) : 0;

    return {
      id: tu.training.id,
      title: tu.training.title,
      description: tu.training.description,
      image: tu.training.image,
      status: tu.status,
      instructor: tu.training.instructor.name,
      averageScore: averageScore,
    };
  });

  // Hitung overall average score dari semua training
  const totalUserScore = trainingsWithScores.reduce(
    (sum, training) => sum + training.averageScore,
    0
  );
  const overallAverageScore =
    trainingsWithScores.length > 0
      ? Math.round(totalUserScore / trainingsWithScores.length)
      : 0;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.profile,
    trainings: trainingsWithScores,
    totalTrainings: user._count.trainingUsers,
    overallAverageScore: overallAverageScore,
  };
};

const logout = async (email) => {
  email = validate(getUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user not found");
  }

  return prismaClient.user.update({
    where: {
      email: email,
    },
    data: {
      token: null,
    },
    select: {
      email: true,
    },
  });
};

export default { register, login, get, logout };
