import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createMeetingValidation,
  getMeetingDetailValidation,
  getMeetingValidation,
  updateMeetingValidation,
} from "../validation/meeting-validation.js";
import { validate } from "../validation/validation.js";

const createMeeting = async (user, request) => {
  const meeting = validate(createMeetingValidation, request);

  // Verify if training exists and user is the instructor
  const training = await prismaClient.training.findUnique({
    where: { id: meeting.trainingId },
    select: {
      id: true,
      instructorId: true,
      users: {
        where: { status: "enrolled" },
      },
    },
  });

  if (!training) {
    throw new ResponseError(404, "Training not found");
  }

  if (training.instructorId !== user.id) {
    throw new ResponseError(
      403,
      "You can only create meetings for your own training"
    );
  }

  // Create meeting
  const newMeeting = await prismaClient.meeting.create({
    data: meeting,
    select: {
      id: true,
      title: true,
      meetingDate: true,
      trainingId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Initialize scores for all enrolled users
  if (training.users.length > 0) {
    const scoreCreations = training.users.map((trainingUser) =>
      prismaClient.score.create({
        data: {
          trainingUserId: trainingUser.id,
          meetingId: newMeeting.id,
          moduleScore: 0,
          quizScore: 0,
          taskScore: 0,
          totalScore: 0,
        },
      })
    );

    // Run score creations in a transaction
    await prismaClient.$transaction(scoreCreations);
  }

  return newMeeting;
};

const getMeetings = async (user, request) => {
  const validated = validate(getMeetingValidation, {
    trainingId: request.trainingId, // Convert string to number
    page: request.page,
    size: request.size,
  });

  // Verify if user has access to this training
  const enrollment = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: validated.trainingId,
      status: {
        in: ["enrolled", "completed"],
      },
    },
  });

  if (!enrollment) {
    throw new ResponseError(
      403,
      "You don't have access to this training's meetings"
    );
  }

  // Calculate pagination
  const skip = (validated.page - 1) * validated.size;

  // Get Total Count
  const total = await prismaClient.meeting.count({
    where: { trainingId: validated.trainingId },
  });

  // Get Meetings
  const meetings = await prismaClient.meeting.findMany({
    where: { trainingId: validated.trainingId },
    skip,
    take: validated.size,
    orderBy: { meetingDate: "asc" },
    select: {
      id: true,
      title: true,
      meetingDate: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          title: true,
          instructor: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    data: meetings, // Changed from meeting to meetings
    paging: {
      page: validated.page,
      total_items: total,
      total_pages: Math.ceil(total / validated.size),
    },
  };
};

const getMeetingDetail = async (user, request) => {
  const validated = validate(getMeetingDetailValidation, {
    trainingId: request.trainingId,
    meetingId: request.meetingId,
  });

  // Verify if user has access to this training
  const enrollment = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: validated.trainingId,
      status: {
        in: ["enrolled", "completed"],
      },
    },
  });

  if (!enrollment) {
    throw new ResponseError(
      403,
      "You don't have access to this training's meetings"
    );
  }

  // Get Meeting Detail
  const meeting = await prismaClient.meeting.findUnique({
    where: { id: validated.meetingId },
    select: {
      id: true,
      title: true,
      meetingDate: true,
      createdAt: true,
      updatedAt: true,
      training: {
        select: {
          title: true,
          instructor: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!meeting) {
    throw new ResponseError(404, "Meeting not found");
  }

  return meeting;
};

const updateMeeting = async (user, meetingId, trainingId, request) => {
  const meeting = validate(updateMeetingValidation, request);

  const existingMeeting = await prismaClient.meeting.findFirst({
    where: {
      id: meetingId,
      trainingId: trainingId,
    },
    include: {
      training: true, // Include full training data
    },
  });

  // Cek apakah meeting ada dan milik instructor yang sama
  if (!existingMeeting) {
    throw new ResponseError(404, "Meeting is not found");
  }

  // Tambahan validasi instructor
  if (existingMeeting.training.instructorId !== user.id) {
    throw new ResponseError(
      403,
      "You are not authorized to update this meeting"
    );
  }

  return prismaClient.meeting.update({
    where: {
      id: meetingId,
    },
    data: {
      title: meeting.title,
      meetingDate: meeting.meetingDate,
    },
    select: {
      id: true,
      title: true,
      meetingDate: true,
      trainingId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export default { createMeeting, getMeetings, getMeetingDetail, updateMeeting };
