import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createModuleValidation,
  getDetailModuleValidation,
  getModulesValidation,
  submitModuleAnswerValidation,
  submitScoreModuleValidation,
} from "../validation/module-validation.js";
import { validate } from "../validation/validation.js";

const createModule = async (user, meetingId, request, file) => {
  const module = validate(createModuleValidation, request);

  // Check if meeting exists and user is the instructor
  const meeting = await prismaClient.meeting.findFirst({
    where: {
      id: meetingId,
      training: {
        instructorId: user.id,
      },
    },
    include: {
      training: true,
    },
  });

  if (!meeting) {
    throw new ResponseError(
      404,
      "Meeting not found or you're not the instructor"
    );
  }

  if (!file) {
    throw new ResponseError(400, "PDF File is required");
  }

  return prismaClient.module.create({
    data: {
      ...module,
      meetingId: meetingId,
      content: file.path.replace(/\\/g, "/").replace("public/", ""), // Simpan path relatif
    },
    select: {
      id: true,
      meetingId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      meeting: {
        select: {
          id: true,
          title: true,
          training: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
};

const submitModuleAnswer = async (user, moduleId, request) => {
  // Validate the request
  const { answer } = validate(submitModuleAnswerValidation, request);

  // Check if module exists
  const module = await prismaClient.module.findFirst({
    where: {
      id: moduleId,
      meeting: {
        training: {
          users: {
            some: {
              userId: user.id,
              status: "enrolled",
            },
          },
        },
      },
    },
    include: {
      meeting: {
        include: {
          training: true,
        },
      },
    },
  });

  if (!module) {
    throw new ResponseError(
      404,
      "Module not found or you're not enrolled in this training"
    );
  }

  // Get the training user record (we need this ID for the submission)
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: module.meeting.training.id,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(404, "You're not enrolled in this training");
  }

  // Check if there's an existing submission
  const existingSubmission = await prismaClient.moduleSubmission.findFirst({
    where: {
      moduleId: moduleId,
      trainingUserId: trainingUser.id,
    },
  });

  let submission;

  // Update or create submission
  if (existingSubmission) {
    // Update existing submission
    submission = await prismaClient.moduleSubmission.update({
      where: {
        id: existingSubmission.id,
      },
      data: {
        answer: answer,
        updatedAt: new Date(),
      },
      include: {
        module: {
          include: {
            meeting: {
              include: {
                training: true,
              },
            },
          },
        },
      },
    });
  } else {
    // Create new submission
    submission = await prismaClient.moduleSubmission.create({
      data: {
        moduleId: moduleId,
        trainingUserId: trainingUser.id,
        answer: answer,
      },
      include: {
        module: {
          include: {
            meeting: {
              include: {
                training: true,
              },
            },
          },
        },
      },
    });
  }

  // Return relevant data
  return {
    id: submission.id,
    moduleId: submission.moduleId,
    answer: submission.answer,
    score: submission.score,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    module: {
      id: submission.module.id,
      title: submission.module.title,
      meetingId: submission.module.meetingId,
      meeting: {
        id: submission.module.meeting.id,
        title: submission.module.meeting.title,
        training: {
          id: submission.module.meeting.training.id,
          title: submission.module.meeting.training.title,
        },
      },
    },
  };
};

const getModules = async (user, request) => {
  const { meetingId, page, size } = validate(getModulesValidation, request);

  // Check if meeting exists and user is enrolled in the training
  const meeting = await prismaClient.meeting.findFirst({
    where: {
      id: meetingId,
      training: {
        users: {
          some: {
            userId: user.id,
            status: "enrolled",
          },
        },
      },
    },
    include: {
      training: true,
    },
  });

  if (!meeting) {
    throw new ResponseError(
      404,
      "Meeting not found or you're not enrolled in this training"
    );
  }

  // Calculate pagination
  const skip = (page - 1) * size;

  // Get all modules for the meeting with pagination
  const modules = await prismaClient.module.findMany({
    where: {
      meetingId: meetingId,
    },
    skip: skip,
    take: size,
    select: {
      id: true,
      title: true,
      content: true,
      moduleScore: true,
      meetingId: true,
      moduleAnswer: true,
      createdAt: true,
      updatedAt: true,
      meeting: {
        select: {
          id: true,
          title: true,
          training: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  // Get total count of modules for pagination metadata
  const totalItems = await prismaClient.module.count({
    where: {
      meetingId: meetingId,
    },
  });

  return {
    data: modules,
    paging: {
      page: page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / size),
    },
  };
};

const getModuleDetail = async (user, request) => {
  const validationResult = validate(getDetailModuleValidation, request);
  const { meetingId, moduleId } = validationResult;

  // Cek apakah module ada dan user terdaftar di training yang sesuai
  const module = await prismaClient.module.findFirst({
    where: {
      id: moduleId,
      meetingId: meetingId,
      meeting: {
        training: {
          users: {
            some: {
              userId: user.id,
              status: "enrolled",
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      moduleScore: true,
      moduleAnswer: true,
      createdAt: true,
      updatedAt: true,
      meeting: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          training: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!module) {
    throw new ResponseError(
      404,
      "Module not found or you're not enrolled in this training"
    );
  }

  return module;
};

const submitModuleScore = async (user, moduleId, request) => {
  const { moduleScore } = validate(submitScoreModuleValidation, request);

  const module = await prismaClient.module.findFirst({
    where: {
      id: moduleId,
      meeting: {
        training: {
          instructorId: user.id,
        },
      },
    },
    include: {
      meeting: {
        include: {
          training: {
            include: {
              users: {
                where: {
                  status: "enrolled",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!module) {
    throw new ResponseError(
      404,
      "module not found or you're not the instructor"
    );
  }

  // Start a transaction to update both module and score
  return prismaClient.$transaction(async (tx) => {
    // Update module score
    const updatedModule = await tx.module.update({
      where: {
        id: moduleId,
      },
      data: {
        moduleScore: moduleScore,
      },
      select: {
        id: true,
        title: true,
        moduleAnswer: true,
        moduleScore: true,
        meetingId: true,
        createdAt: true,
        updatedAt: true,
        meeting: {
          select: {
            id: true,
            title: true,
            training: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Get enrolled users' training_users records
    const enrolledUsers = module.meeting.training.users;

    // Update scores for all enrolled users
    for (const trainingUser of enrolledUsers) {
      const existingScore = await tx.score.findFirst({
        where: {
          trainingUserId: trainingUser.id,
          meetingId: module.meetingId,
        },
      });

      if (existingScore) {
        await tx.score.update({
          where: {
            id: existingScore.id,
          },
          data: {
            moduleScore: moduleScore,
            totalScore:
              (moduleScore +
                existingScore.quizScore +
                existingScore.taskScore) /
              3,
          },
        });
      }
    }

    return updatedModule;
  });
};

export default {
  createModule,
  submitModuleAnswer,
  getModules,
  submitModuleScore,
  getModuleDetail,
};
