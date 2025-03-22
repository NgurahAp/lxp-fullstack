import { prismaClient } from "../application/database.js";
import {
  createTrainingUserValidation,
  createTrainingValidation,
  getInstructorTrainingsValidation,
  getStudentTrainingsValidation,
  getTrainingDetailValidation,
  updateTrainingValidation,
} from "../validation/training-validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import path from "path";
import fs from "fs";

const createTraining = async (user, request, file) => {
  const training = validate(createTrainingValidation, request);

  // Ensure the instructorId matches the logged-in user's ID
  if (training.instructorId !== user.id) {
    throw new ResponseError(
      404,
      "You can only create training with your own instructor ID"
    );
  }

  // If file exists, add image path to training data
  const trainingData = {
    ...training,
  };

  if (file) {
    trainingData.image = "/trainings/" + path.basename(file.path);
  }

  return prismaClient.training.create({
    data: trainingData,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructorId: true,
      createdAt: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const createTrainingUser = async (request) => {
  const trainingUser = validate(createTrainingUserValidation, request);

  // Verify if training and user exist
  const training = await prismaClient.training.findUnique({
    where: { id: trainingUser.trainingId },
  });
  if (!training) {
    throw new ResponseError(404, "Training not Found");
  }

  const user = await prismaClient.user.findUnique({
    where: { id: trainingUser.userId },
  });

  if (!user) {
    throw new ResponseError(404, "User not Found");
  }

  const existingEnrollment = await prismaClient.training_Users.findFirst({
    where: {
      trainingId: trainingUser.trainingId,
      userId: trainingUser.userId,
    },
  });

  if (existingEnrollment) {
    throw new ResponseError(400, "User already enrolled in this training");
  }

  return prismaClient.training_Users.create({
    data: trainingUser,
    select: {
      id: true,
      trainingId: true,
      userId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

const getStudentTrainings = async (user, request) => {
  const option = validate(getStudentTrainingsValidation, request);

  // calculate pagination
  const skip = (option.page - 1) * option.size;

  const where = {
    userId: user.id,
  };

  if (option.status) {
    where.status = option.status;
  }

  // Get Total count of pagination
  const total = await prismaClient.training_Users.count({ where });

  // Get Trainings
  const trainings = await prismaClient.training_Users.findMany({
    where,
    skip,
    take: option.size,
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,

          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // Include meetings to calculate progress
          meetings: {
            select: {
              id: true,
              title: true,
              modules: true,
              quizzes: true,
              tasks: true,
            },
          },
        },
      },
      // Include scores to calculate progress
      scores: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate progress for each training
  const trainingsWithProgress = await Promise.all(
    trainings.map(async (training) => {
      // Calculate progress for each meeting
      const meetingsProgress = training.training.meetings.map((meeting) => {
        // Find the user's score for this meeting
        const userScore = training.scores.find(
          (score) => score.meetingId === meeting.id
        );

        // Calculate module progress
        const totalModules = meeting.modules.length;
        const completedModules = meeting.modules.filter(
          (module) => module.moduleAnswer !== null && module.moduleAnswer !== ""
        ).length;

        // Calculate quiz progress (based on scores)
        const totalQuizzes = meeting.quizzes.length;
        const completedQuizzes = userScore
          ? userScore.quizScore > 0
            ? totalQuizzes
            : 0
          : 0;

        // Calculate task progress
        const totalTasks = meeting.tasks.length;
        const completedTasks = meeting.tasks.filter(
          (task) => task.taskAnswer !== null && task.taskAnswer !== ""
        ).length;

        // Calculate total progress
        const totalItems = totalModules + totalQuizzes + totalTasks;
        const completedItems =
          completedModules + completedQuizzes + completedTasks;

        const progressPercentage =
          totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return {
          meetingId: meeting.id,
          title: meeting.title,
          progress: progressPercentage,
        };
      });

      // Calculate overall training progress
      const overallProgress =
        meetingsProgress.length > 0
          ? Math.round(
              meetingsProgress.reduce(
                (sum, meeting) => sum + meeting.progress,
                0
              ) / meetingsProgress.length
            )
          : 0;

      // Remove unnecessary fields before returning
      delete training.scores;
      delete training.training.meetings;

      return {
        ...training,
        progress: overallProgress,
        meetingsProgress,
      };
    })
  );

  return {
    data: trainingsWithProgress,
    paging: {
      page: option.page,
      total_items: total,
      total_pages: Math.ceil(total / option.size),
    },
  };
};

const getInstructorTrainings = async (user, request) => {
  const option = validate(getInstructorTrainingsValidation, request);

  const skip = (option.page - 1) * option.size;

  const where = {
    instructorId: user.id,
  };

  if (option.status) {
    where.status = option.status;
  }

  const total = await prismaClient.training.count({ where });

  const trainings = await prismaClient.training.findMany({
    where,
    skip,
    take: option.size,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });
  return {
    data: {
      training: trainings,
    },
    paging: {
      page: option.page,
      total_items: total,
      total_pages: Math.ceil(total / option.size),
    },
  };
};

const getTrainingDetail = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, { trainingId }).trainingId;

  // Check if user has access to this training
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      trainingId: trainingId,
      userId: user.id,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(403, "You dont have access to this training");
  }

  // Get training details with meetings
  const training = await prismaClient.training.findUnique({
    where: { id: trainingId },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meetings: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              moduleAnswer: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              quizScore: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              taskAnswer: true,
            },
          },
        },
        orderBy: {
          meetingDate: "asc",
        },
      },
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(404, "Training not found");
  }

  return {
    data: training,
  };
};

const getInstructorTrainingDetail = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, { trainingId }).trainingId;

  // Get training details with meetings
  const training = await prismaClient.training.findUnique({
    where: { id: trainingId, instructorId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meetings: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              moduleAnswer: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              quizScore: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              taskAnswer: true,
            },
          },
        },
        orderBy: {
          meetingDate: "asc",
        },
      },
      _count: {
        select: {
          meetings: true,
          users: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(
      404,
      "Training not found or you dont have access to this training"
    );
  }

  return {
    data: training,
  };
};

const updateTraining = async (user, trainingId, request, file) => {
  const training = validate(updateTrainingValidation, request);

  if (training.instructorId !== user.id) {
    throw new ResponseError(
      404,
      "You can only update training with your own instructor ID"
    );
  }

  // Cek keberadaan training dengan ID dari parameter
  const existingTraining = await prismaClient.training.findUnique({
    where: {
      id: trainingId,
    },
  });

  if (!existingTraining || existingTraining.instructorId !== user.id) {
    throw new ResponseError(405, "Training is not found");
  }

  const trainingData = {
    ...training,
  };

  // Jika ada file baru dan training lama memiliki gambar, hapus gambar lama
  if (file && existingTraining.image) {
    try {
      // Gunakan process.cwd() sebagai pengganti __dirname
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        existingTraining.image
      );

      // Cek apakah file ada sebelum dihapus
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`Successfully deleted old image: ${oldImagePath}`);
      }
    } catch (err) {
      console.error("Error deleting old image:", err);
      // Lanjutkan proses meskipun gagal menghapus (non-critical error)
    }
  }

  if (file) {
    trainingData.image = "/trainings/" + path.basename(file.path);
  }

  return prismaClient.training.update({
    where: {
      id: trainingId,
    },
    data: trainingData,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      instructorId: true,
      createdAt: true,
      updatedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export default {
  createTraining,
  createTrainingUser,
  getStudentTrainings,
  getInstructorTrainings,
  getTrainingDetail,
  getInstructorTrainingDetail,
  updateTraining,
};
