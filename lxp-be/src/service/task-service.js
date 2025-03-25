import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createTaskValidation,
  getDetailTaskValidation,
  submitScoreTaskValidation,
} from "../validation/task-validation.js";
import { validate } from "../validation/validation.js";
import path from "path";

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

  if (!file) {
    throw new ResponseError(400, "PDF File is required");
  }

  // Extract just the relative path from /tasks/ onwards
  const relativePath = "tasks/" + path.basename(file.path);

  // Get the training user record (we need this ID for the submission)
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: task.meeting.training.id,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(404, "You're not enrolled in this training");
  }

  const existingSubmission = await prismaClient.taskSubmission.findFirst({
    where: {
      taskId: taskId,
      trainingUserId: trainingUser.id,
    },
  });

  let submission;

  if (existingSubmission) {
    submission = await prismaClient.taskSubmission.update({
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
    submission = await prismaClient.taskSubmission.create({
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

  return {
    id: submission.id,
    taskId: submission.taskId,
    answer: submission.answer,
    score: submission.score,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    task: {
      id: submission.task.id,
      title: submission.task.title,
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

const submitTaskScore = async (user, taskId, request) => {
  const { taskScore } = validate(submitScoreTaskValidation, request);

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

  // Start a transaction to update both task and score
  return prismaClient.$transaction(async (tx) => {
    const updateTask = await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        taskScore: taskScore,
      },
      select: {
        id: true,
        title: true,
        taskQuestion: true,
        taskAnswer: true,
        taskScore: true,
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
    const enrolledUsers = task.meeting.training.users;

    // Update scores for all enrolled users
    for (const trainingUser of enrolledUsers) {
      const existingScore = await tx.score.findFirst({
        where: {
          trainingUserId: trainingUser.id,
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
              (taskScore +
                existingScore.quizScore +
                existingScore.moduleScore) /
              3,
          },
        });
      }
    }

    return updateTask;
  });
};

export default { createTask, submitTask, getDetailTask, submitTaskScore };
