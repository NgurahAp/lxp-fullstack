import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createTaskValidation,
  deleteTaskValidation,
  getDetailTaskValidation,
  getInstructorDetailTaskValidation,
  submitScoreTaskValidation,
  updateTaskValidation,
} from "../validation/task-validation.js";
import { validate } from "../validation/validation.js";
import path from "path";
import fs from "fs";
import trainingService from "./training-service.js";

const createTask = async (user, meetingId, request) => {
  const task = validate(createTaskValidation, request);

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

  return prismaClient.task.create({
    data: {
      ...task,
      meetingId: meetingId,
    },
    select: {
      id: true,
      title: true,
      taskQuestion: true,
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
};

const submitTask = async (user, taskId, file) => {
  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
    },
    include: {
      meeting: {
        include: {
          training: {
            include: {
              users: {
                where: {
                  userId: user.id,
                  status: "enrolled",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new ResponseError(404, "Task not found");
  }

  if (task.meeting.training.users.length === 0) {
    throw new ResponseError(403, "You are not enrolled in this training");
  }

  if (!file) {
    throw new ResponseError(400, "File is required");
  }

  // Validate file type
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname || file.path).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new ResponseError(400, "Only PDF, DOC, and DOCX files are allowed");
  }

  const relativePath = "tasks/" + path.basename(file.path);

  // Get the training user record
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: task.meeting.training.id,
      status: "enrolled",
    },
  });

  if (!trainingUser) {
    throw new ResponseError(404, "You're not enrolled in this training");
  }

  return prismaClient.$transaction(async (tx) => {
    const existingSubmission = await tx.taskSubmission.findFirst({
      where: {
        taskId: taskId,
        trainingUserId: trainingUser.id,
      },
    });

    let submission;

    if (existingSubmission) {
      submission = await tx.taskSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          answer: relativePath,
          updatedAt: new Date(),
        },
        include: {
          task: {
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
      submission = await tx.taskSubmission.create({
        data: {
          taskId: taskId,
          trainingUserId: trainingUser.id,
          answer: relativePath,
        },
        include: {
          task: {
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

    // Update task score in the scores table
    const existingScore = await tx.score.findFirst({
      where: {
        trainingUserId: trainingUser.id,
        meetingId: task.meetingId,
      },
    });

    if (existingScore) {
      const totalScore = Math.round(
        (existingScore.moduleScore + existingScore.quizScore + submission.score) / 3
      );
      
      await tx.score.update({
        where: { id: existingScore.id },
        data: {
          taskScore: submission.score,
          totalScore: totalScore,
          updatedAt: new Date(),
        },
      });
    } else {
      await tx.score.create({
        data: {
          trainingUserId: trainingUser.id,
          meetingId: task.meetingId,
          taskScore: submission.score,
          totalScore: Math.round(submission.score / 3),
        },
      });
    }

    // Check and update training completion status
    const isCompleted = await trainingService.checkAndUpdateTrainingCompletion(trainingUser.id, tx);

    return {
      id: submission.id,
      taskId: submission.taskId,
      answer: submission.answer,
      score: submission.score,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      trainingCompleted: isCompleted, // Add this to response
      task: {
        id: submission.task.id,
        title: submission.task.title,
        taskQuestion: submission.task.taskQuestion,
        meetingId: submission.task.meetingId,
        meeting: {
          id: submission.task.meeting.id,
          title: submission.task.meeting.title,
          training: {
            id: submission.task.meeting.training.id,
            title: submission.task.meeting.training.title,
          },
        },
      },
    };
  });
};

const getDetailTask = async (user, request) => {
  const validationResult = validate(getDetailTaskValidation, request);
  const { meetingId, taskId } = validationResult;

  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
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
      taskQuestion: true,
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

  if (!task) {
    throw new ResponseError(
      404,
      "Task not found or you're not enrolled in this training"
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
  const taskSubmission = await prismaClient.taskSubmission.findFirst({
    where: {
      taskId: taskId,
      trainingUserId: trainingUser.id,
    },
    select: {
      answer: true,
      score: true,
    },
  });

  return {
    ...task,
    submission: taskSubmission || { answer: null, score: 0 },
  };
};

const getInstructorDetailTask = async (user, request) => {
  const validationResult = validate(getInstructorDetailTaskValidation, request);
  const { trainingId, meetingId, taskId } = validationResult;

  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
      meetingId: meetingId,
      meeting: {
        training: {
          id: trainingId,
          instructorId: user.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
      taskQuestion: true,
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

  if (!task) {
    throw new ResponseError(
      404,
      "Task not found or you're not instructor in this training"
    );
  }

  return task;
};

const submitTaskScore = async (user, taskId, request) => {
  const { taskScore, trainingUserId } = validate(
    submitScoreTaskValidation,
    request
  );

  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
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

  if (!task) {
    throw new ResponseError(404, "Task not found or you're not the instructor");
  }

  // Add a check to make sure moduleScore is a valid number
  if (typeof taskScore !== "number" || isNaN(taskScore)) {
    throw new ResponseError(400, "Invalid task score provided");
  }

  // Add a check to validate trainingUserId
  if (!trainingUserId) {
    throw new ResponseError(400, "Training user ID is required");
  }

  // Start a transaction to update both task and score
  return prismaClient.$transaction(async (tx) => {
    const submission = await tx.taskSubmission.findFirst({
      where: {
        taskId: taskId,
        trainingUserId: trainingUserId,
      },
      include: {
        trainingUser: true,
      },
    });

    if (!submission) {
      throw new ResponseError(404, "Task submission not found for this user");
    }

    const updatedSubmission = await tx.taskSubmission.update({
      where: {
        id: submission.id,
      },
      data: {
        score: taskScore,
      },
    });

    const existingScore = await tx.score.findFirst({
      where: {
        trainingUserId: trainingUserId,
        meetingId: task.meetingId,
      },
    });

    if (existingScore) {
      await tx.score.update({
        where: {
          id: existingScore.id,
        },
        data: {
          taskScore: taskScore,
          totalScore:
            (existingScore.moduleScore + existingScore.quizScore + taskScore) /
            3,
        },
      });
    } else {
      await tx.score.create({
        data: {
          trainingUserId: trainingUserId,
          meetingId: task.meetingId,
          taskScore: taskScore,
          totalScore: taskScore / 3, // since quiz and task are 0
        },
      });
    }

    return {
      id: task.id,
      title: task.title,
      meetingId: task.meetingId,
      updatedSubmission: {
        id: updatedSubmission.id,
        trainingUserId: submission.trainingUserId,
        score: taskScore,
      },
      meeting: {
        id: task.meeting.id,
        title: task.meeting.title,
        training: {
          id: task.meeting.training.id,
          title: task.meeting.training.title,
        },
      },
      createdAt: task.createdAt,
      updatedAt: new Date(),
    };
  });
};

const updateTask = async (user, request) => {
  const task = validate(updateTaskValidation, request);
  const { trainingId, meetingId, taskId, title, taskQuestion } = task;

  const existingTask = await prismaClient.task.findUnique({
    where: {
      id: taskId,
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

  if (!existingTask) {
    throw new ResponseError(404, "Task not found");
  }

  // Validate that training matches and user is the instructor
  if (
    existingTask.meeting.training.id !== trainingId ||
    existingTask.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to update this task"
    );
  }

  return prismaClient.task.update({
    where: {
      id: taskId,
    },
    data: {
      title: title,
      taskQuestion: taskQuestion,
    },
    select: {
      id: true,
      title: true,
      taskQuestion: true,
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
};

const deleteTask = async (user, request) => {
  const task = validate(deleteTaskValidation, request);
  const { trainingId, meetingId, taskId } = task;

  const existingTask = await prismaClient.task.findUnique({
    where: {
      id: taskId,
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

  if (!existingTask) {
    throw new ResponseError(404, "Task not found");
  }

  // Validate that training matches and user is the instructor
  if (
    existingTask.meeting.training.id !== trainingId ||
    existingTask.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to delete this task"
    );
  }

  // Find all task submissions related to this task

  return await prismaClient.$transaction(async (tx) => {
    const submissions = await prismaClient.taskSubmission.findMany({
      where: {
        taskId: taskId,
      },
    });

    const userScores = {};
    for (const submission of submissions) {
      const userId = submission.trainingUserId;
      if (!userScores[userId]) {
        userScores[userId] = 0;
      }
      userScores[userId] += submission.score;
    }

    for (const submission of submissions) {
      if (submission.answer) {
        try {
          const filePath = path.join("public", submission.answer);
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (error) {
          // Log the error but continue with deletion of database records
          console.log(
            `Error deleting file for submission ${submission.id}:`,
            error
          );
        }
      }
    }

    // Then delete all submissions from the database
    if (submissions.length > 0) {
      await tx.taskSubmission.deleteMany({
        where: {
          taskId: taskId,
        },
      });
    }

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
              taskScore: Math.max(0, userScore.taskScore - scoreToReduce),
            },
          });
        }
      }
    }

    // Finally, delete the task itself
    const deletedTask = await tx.task.delete({
      where: {
        id: taskId,
      },
    });

    return deletedTask;
  });
};

export default {
  createTask,
  submitTask,
  getDetailTask,
  getInstructorDetailTask,
  submitTaskScore,
  updateTask,
  deleteTask,
};
