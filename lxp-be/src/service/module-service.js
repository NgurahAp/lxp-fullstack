import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createModuleValidation,
  deleteModuleValidation,
  getDetailModuleValidation,
  submitModuleAnswerValidation,
  submitScoreModuleValidation,
  updateModuleValidation,
} from "../validation/module-validation.js";
import fs from "fs";
import path from "path";
import { validate } from "../validation/validation.js";
import trainingService from "./training-service.js";

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

  // Get the training user record
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: module.meeting.training.id,
      status: "enrolled",
    },
  });

  if (!trainingUser) {
    throw new ResponseError(404, "You're not enrolled in this training");
  }

  return prismaClient.$transaction(async (tx) => {
    // Check if there's an existing submission
    const existingSubmission = await tx.moduleSubmission.findFirst({
      where: {
        moduleId: moduleId,
        trainingUserId: trainingUser.id,
      },
    });

    let submission;

    // Update or create submission
    if (existingSubmission) {
      submission = await tx.moduleSubmission.update({
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
      submission = await tx.moduleSubmission.create({
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

    // Check and update training completion status
    const isCompleted = await trainingService.checkAndUpdateTrainingCompletion(trainingUser.id, tx);

    return {
      id: submission.id,
      moduleId: submission.moduleId,
      answer: submission.answer,
      score: submission.score,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      trainingCompleted: isCompleted, // Add this to response
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
  });
};

const getModuleDetail = async (user, request) => {
  const validationResult = validate(getDetailModuleValidation, request);
  const { meetingId, moduleId } = validationResult;

  // Check if the module exists and the user is enrolled in the corresponding training
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

  // Get the training user record
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      training: {
        meetings: {
          some: {
            id: meetingId,
          },
        },
      },
    },
  });

  // Get the module submission for this user if exists
  const moduleSubmission = await prismaClient.moduleSubmission.findFirst({
    where: {
      moduleId: moduleId,
      trainingUserId: trainingUser.id,
    },
    select: {
      answer: true,
      score: true,
    },
  });

  // Add submission data to the module response
  return {
    ...module,
    submission: moduleSubmission || { answer: null, score: 0 },
  };
};

const submitModuleScore = async (user, moduleId, request) => {
  // Validate incoming request data
  const { moduleScore, trainingUserId } = validate(
    submitScoreModuleValidation,
    request
  );

  // Check if module exists and user is the instructor
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
      "Module not found or you're not the instructor"
    );
  }

  // Add a check to make sure moduleScore is a valid number
  if (typeof moduleScore !== "number" || isNaN(moduleScore)) {
    throw new ResponseError(400, "Invalid module score provided");
  }

  // Add a check to validate trainingUserId
  if (!trainingUserId) {
    throw new ResponseError(400, "Training user ID is required");
  }

  // Start a transaction to update module submissions
  return prismaClient.$transaction(async (tx) => {
    // Find the specific module submission for this user
    const submission = await tx.moduleSubmission.findFirst({
      where: {
        moduleId: moduleId,
        trainingUserId: trainingUserId,
      },
      include: {
        trainingUser: true,
      },
    });

    if (!submission) {
      throw new ResponseError(404, "Module submission not found for this user");
    }

    // Update this specific submission
    const updatedSubmission = await tx.moduleSubmission.update({
      where: {
        id: submission.id,
      },
      data: {
        score: moduleScore,
      },
    });

    // Update the score record for this specific user
    const existingScore = await tx.score.findFirst({
      where: {
        trainingUserId: trainingUserId,
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
            (moduleScore + existingScore.quizScore + existingScore.taskScore) /
            3,
        },
      });
    } else {
      await tx.score.create({
        data: {
          trainingUserId: trainingUserId,
          meetingId: module.meetingId,
          moduleScore: moduleScore,
          totalScore: moduleScore / 3, // since quiz and task are 0
        },
      });
    }

    // Return module details with updated submission
    return {
      id: module.id,
      title: module.title,
      meetingId: module.meetingId,
      updatedSubmission: {
        id: updatedSubmission.id,
        trainingUserId: submission.trainingUserId,
        score: moduleScore,
      },
      meeting: {
        id: module.meeting.id,
        title: module.meeting.title,
        training: {
          id: module.meeting.training.id,
          title: module.meeting.training.title,
        },
      },
      createdAt: module.createdAt,
      updatedAt: new Date(),
    };
  });
};

const updateModule = async (user, request, file) => {
  const module = validate(updateModuleValidation, request);
  const { trainingId, meetingId, moduleId, title } = module;

  // Check if module exists
  const existingModule = await prismaClient.module.findUnique({
    where: {
      id: moduleId,
      meetingId: meetingId,
    },
    include: {
      meeting: {
        include: {
          training: true,
        },
      },
    },
  });

  if (!existingModule) {
    throw new ResponseError(404, "Module not found");
  }

  // Validate that training matches and user is the instructor
  if (
    existingModule.meeting.training.id !== trainingId ||
    existingModule.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to update this module"
    );
  }

  // Prepare update data
  const updateData = {
    title: title,
  };

  // Handle file update if a new file is provided
  if (file) {
    // Store the path to the new file
    updateData.content = file.path.replace(/\\/g, "/").replace("public/", "");

    // Delete the old file if it exists
    if (existingModule.content) {
      const oldFilePath = path.join("public", existingModule.content);

      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (error) {
        console.error("Error deleting old file:", error);
        // Continue with update even if file deletion fails
      }
    }
  }

  // Update the module
  return prismaClient.module.update({
    where: {
      id: moduleId,
    },
    data: updateData,
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

const deleteModule = async (user, request) => {
  const module = validate(deleteModuleValidation, request);
  const { trainingId, meetingId, moduleId } = module;

  const existingModule = await prismaClient.module.findUnique({
    where: {
      id: moduleId,
      meetingId: meetingId,
    },
    include: {
      meeting: {
        include: {
          training: true,
        },
      },
    },
  });

  if (!existingModule) {
    throw new ResponseError(404, "Module not found");
  }

  // Validate that training matches and user is the instructor
  if (
    existingModule.meeting.training.id !== trainingId ||
    existingModule.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to delete this module"
    );
  }

  // Delete the file if it exists
  if (existingModule.content) {
    const filePath = path.join("public", existingModule.content);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue with deletion even if file deletion fails
    }
  }

  return prismaClient.$transaction(async (tx) => {
    // Get module submissions and group them by user to update scores
    const submissions = await tx.moduleSubmission.findMany({
      where: { moduleId: moduleId },
    });

    // Group submissions by trainingUserId and calculate total score per user
    const userScores = {};
    for (const submission of submissions) {
      const userId = submission.trainingUserId;
      if (!userScores[userId]) {
        userScores[userId] = 0;
      }
      userScores[userId] += submission.score;
    }

    // Delete module submissions
    await tx.moduleSubmission.deleteMany({
      where: { moduleId: moduleId },
    });

    // Update only moduleScore for each affected user
    for (const [userId, scoreToReduce] of Object.entries(userScores)) {
      if (scoreToReduce > 0) {
        // Find user's score for this meeting
        const userScore = await tx.score.findFirst({
          where: {
            trainingUserId: userId,
            meetingId: meetingId,
          },
        });

        if (userScore) {
          // Only update moduleScore, leave totalScore unchanged
          await tx.score.update({
            where: { id: userScore.id },
            data: {
              moduleScore: Math.max(0, userScore.moduleScore - scoreToReduce),
            },
          });
        }
      }
    }

    // Delete the module
    return tx.module.delete({
      where: {
        id: moduleId,
      },
      select: {
        id: true,
        meetingId: true,
        title: true,
      },
    });
  });
};

export default {
  createModule,
  submitModuleAnswer,
  submitModuleScore,
  getModuleDetail,
  updateModule,
  deleteModule,
};
