import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createTaskValidation,
  getDetailTaskValidation,
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
      taskScore: true,
      meetingId: true,
      taskAnswer: true,
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

  return prismaClient.task.update({
    where: {
      id: taskId,
    },
    data: {
      taskAnswer: relativePath,
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
    },
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
      taskAnswer: true,
      taskScore: true,
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

  return task;
};

export default { createTask, submitTask, getDetailTask };
