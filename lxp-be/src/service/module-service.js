import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createModuleValidation,
  submitModuleAnswerValidation,
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
};

const submitModuleAnswer = async (user, moduleId, request) => {
  // Kita perlu destructure moduleAnswer dari object hasil validasi tersebut
  const { moduleAnswer } = validate(submitModuleAnswerValidation, request);

  // Check if module exists and user is enrolled in the training
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

  // Update the module with the answer
  return prismaClient.module.update({
    where: {
      id: moduleId,
    },
    data: {
      moduleAnswer: moduleAnswer,
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
};

export default { createModule, submitModuleAnswer };
