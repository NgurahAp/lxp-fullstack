import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createTaskValidation } from "../validation/task-validation.js";
import { validate } from "../validation/validation.js";

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

export default {createTask}
