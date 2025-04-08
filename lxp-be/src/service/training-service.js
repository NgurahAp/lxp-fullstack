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

const createTrainingUser = async (user, request) => {
  const trainingUser = validate(createTrainingUserValidation, request);

  // Verify if training and user exist
  const training = await prismaClient.training.findUnique({
    where: { id: trainingUser.trainingId },
    include: {
      meetings: {
        include: {
          modules: true,
          quizzes: true,
          tasks: true,
        },
      },
    },
  });

  if (!training) {
    throw new ResponseError(404, "Training not Found");
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    throw new ResponseError(404, "User not Found");
  }

  const existingEnrollment = await prismaClient.training_Users.findFirst({
    where: {
      trainingId: trainingUser.trainingId,
      userId: user.id,
    },
  });

  if (existingEnrollment) {
    throw new ResponseError(400, "User already enrolled in this training");
  }

  // Create the enrollment record first to get the training_user ID
  const enrolledUser = await prismaClient.training_Users.create({
    data: {
      trainingId: trainingUser.trainingId,
      userId: user.id, // This was missing!
      status: trainingUser.status,
    },
  });

  // For each meeting in the training, create related submissions and scores
  for (const meeting of training.meetings) {
    // Create module submissions for this meeting
    for (const module of meeting.modules) {
      await prismaClient.moduleSubmission.create({
        data: {
          moduleId: module.id,
          trainingUserId: enrolledUser.id,
          score: 0,
        },
      });
    }

    // Create quiz submissions for this meeting
    for (const quiz of meeting.quizzes) {
      await prismaClient.quizSubmission.create({
        data: {
          quizId: quiz.id,
          trainingUserId: enrolledUser.id,
          score: 0,
          answers: {}, // Empty JSON object for answers
        },
      });
    }

    // Create task submissions for this meeting
    for (const task of meeting.tasks) {
      await prismaClient.taskSubmission.create({
        data: {
          taskId: task.id,
          trainingUserId: enrolledUser.id,
          score: 0,
        },
      });
    }

    // Create a score record for this meeting
    await prismaClient.score.create({
      data: {
        meetingId: meeting.id,
        trainingUserId: enrolledUser.id,
        moduleScore: 0,
        quizScore: 0,
        taskScore: 0,
        totalScore: 0,
      },
    });
  }

  // Return the created training user with additional information
  return prismaClient.training_Users.findUnique({
    where: { id: enrolledUser.id },
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
      moduleSubmissions: true,
      quizSubmissions: true,
      taskSubmissions: true,
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
              modules: {
                select: {
                  id: true,
                },
              },
              quizzes: {
                select: {
                  id: true,
                },
              },
              tasks: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      // Include scores for progress calculation
      scores: true,
      // Include submissions for progress calculation
      moduleSubmissions: {
        select: {
          id: true,
          moduleId: true,
          answer: true,
        },
      },
      quizSubmissions: {
        select: {
          id: true,
          quizId: true,
          score: true,
        },
      },
      taskSubmissions: {
        select: {
          id: true,
          taskId: true,
          answer: true,
        },
      },
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

        // Calculate module progress - check if module submissions exist
        const totalModules = meeting.modules.length;
        const completedModules = meeting.modules.filter((moduleItem) =>
          training.moduleSubmissions.some(
            (submission) =>
              submission.moduleId === moduleItem.id &&
              submission.answer !== null &&
              submission.answer !== ""
          )
        ).length;

        // Calculate quiz progress - check if quiz submissions with scores exist
        const totalQuizzes = meeting.quizzes.length;
        const completedQuizzes = meeting.quizzes.filter((quizItem) =>
          training.quizSubmissions.some(
            (submission) =>
              submission.quizId === quizItem.id && submission.score > 0
          )
        ).length;

        // Calculate task progress - check if task submissions exist
        const totalTasks = meeting.tasks.length;
        const completedTasks = meeting.tasks.filter((taskItem) =>
          training.taskSubmissions.some(
            (submission) =>
              submission.taskId === taskItem.id &&
              submission.answer !== null &&
              submission.answer !== ""
          )
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
      delete training.moduleSubmissions;
      delete training.quizSubmissions;
      delete training.taskSubmissions;
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
              // Get user submissions for this module
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answer: true,
                  score: true,
                },
              },
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              // Get user submissions for this quiz
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answers: true,
                  score: true,
                },
              },
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              // Get user submissions for this task
              submissions: {
                where: {
                  trainingUserId: trainingUser.id,
                },
                select: {
                  id: true,
                  answer: true,
                  score: true,
                },
              },
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

  // Transform the data to format that matches the old structure but with submissions data
  const transformedTraining = {
    ...training,
    meetings: training.meetings.map((meeting) => ({
      ...meeting,
      modules: meeting.modules.map((module) => ({
        id: module.id,
        title: module.title,
        moduleAnswer: module.submissions[0]?.answer || null,
        moduleScore: module.submissions[0]?.score || 0,
        hasSubmission: module.submissions.length > 0,
        submissionId: module.submissions[0]?.id || null,
      })),
      quizzes: meeting.quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        quizScore: quiz.submissions[0]?.score || 0,
        hasSubmission: quiz.submissions.length > 0,
        submissionId: quiz.submissions[0]?.id || null,
      })),
      tasks: meeting.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        taskAnswer: task.submissions[0]?.answer || null,
        taskScore: task.submissions[0]?.score || 0,
        hasSubmission: task.submissions.length > 0,
        submissionId: task.submissions[0]?.id || null,
      })),
    })),
  };

  return {
    data: transformedTraining,
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
              content: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              questions: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              taskQuestion: true,
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

const removeTraining = async (user, trainingId) => {
  trainingId = validate(getTrainingDetailValidation, {
    trainingId,
  }).trainingId;

  const totalTraininginDatabase = await prismaClient.training.count({
    where: {
      id: trainingId,
      instructorId: user.id,
    },
  });

  if (totalTraininginDatabase !== 1) {
    throw new ResponseError(
      404,
      "Training is not found or you are not the instructor of this course"
    );
  }

  // Start a transaction to ensure atomic deletion
  return prismaClient.$transaction(async (tx) => {
    // First, delete deeply nested submissions
    await tx.moduleSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    await tx.quizSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    await tx.taskSubmission.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    // Delete scores
    await tx.score.deleteMany({
      where: { trainingUser: { trainingId } },
    });

    // Delete related meetings and their contents
    const meetings = await tx.meeting.findMany({
      where: { trainingId },
      select: { id: true },
    });

    const meetingIds = meetings.map((meeting) => meeting.id);

    // Delete meeting-related content
    await tx.module.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    await tx.quiz.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    await tx.task.deleteMany({
      where: { meetingId: { in: meetingIds } },
    });

    // Delete meetings
    await tx.meeting.deleteMany({
      where: { trainingId },
    });

    // Delete training users
    await tx.training_Users.deleteMany({
      where: { trainingId },
    });

    // Finally, delete the training
    return tx.training.delete({
      where: {
        id: trainingId,
        instructorId: user.id,
      },
    });
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
  removeTraining,
};
