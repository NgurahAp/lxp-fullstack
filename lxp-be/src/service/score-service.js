import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getScoreValidation,
  getTrainingScoresValidation,
} from "../validation/score-validation.js";
import { validate } from "../validation/validation.js";

const getScore = async (user, request) => {
  const validationResult = validate(getScoreValidation, request);
  const { meetingId } = validationResult;

  // Get training user record first to check enrollment
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
      status: "enrolled",
    },
    select: {
      id: true,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(
      404,
      "Score not found or you're not enrolled in this training"
    );
  }

  const score = await prismaClient.score.findFirst({
    where: {
      trainingUserId: trainingUser.id,
      meetingId: meetingId,
    },
    select: {
      id: true,
      moduleScore: true,
      quizScore: true,
      taskScore: true,
      totalScore: true,
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

  if (!score) {
    throw new ResponseError(404, "Score not found");
  }

  return score;
};

const getTrainingScores = async (user, request) => {
  const validationResult = validate(getTrainingScoresValidation, request);
  const { trainingId } = validationResult;

  // Check if user is enrolled in the training
  const trainingUser = await prismaClient.training_Users.findFirst({
    where: {
      userId: user.id,
      trainingId: trainingId,
      status: "enrolled",
    },
    select: {
      id: true,
    },
  });

  if (!trainingUser) {
    throw new ResponseError(
      404,
      "Training not found or you're not enrolled in this training"
    );
  }

  // Get training details with all meetings and their scores
  const trainingWithScores = await prismaClient.training.findUnique({
    where: {
      id: trainingId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      meetings: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
          scores: {
            where: {
              trainingUserId: trainingUser.id,
            },
            select: {
              moduleScore: true,
              quizScore: true,
              taskScore: true,
              totalScore: true,
            },
          },
        },
      },
    },
  });

  if (!trainingWithScores) {
    throw new ResponseError(404, "Training not found");
  }

  // Calculate average scores across all meetings
  let totalModuleScore = 0;
  let totalQuizScore = 0;
  let totalTaskScore = 0;
  let overallTotalScore = 0;
  let meetingsWithScores = 0;

  const meetingsScores = trainingWithScores.meetings.map((meeting) => {
    const score = meeting.scores[0] || {
      moduleScore: 0,
      quizScore: 0,
      taskScore: 0,
      totalScore: 0,
    };

    if (score.totalScore > 0) {
      meetingsWithScores++;
      totalModuleScore += score.moduleScore;
      totalQuizScore += score.quizScore;
      totalTaskScore += score.taskScore;
      overallTotalScore += score.totalScore;
    }

    return {
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      meetingDate: meeting.meetingDate,
      scores: score,
    };
  });

  // Calculate averages
  const averageScores =
    meetingsWithScores > 0
      ? {
          averageModuleScore: Math.round(totalModuleScore / meetingsWithScores),
          averageQuizScore: Math.round(totalQuizScore / meetingsWithScores),
          averageTaskScore: Math.round(totalTaskScore / meetingsWithScores),
          averageTotalScore: Math.round(overallTotalScore / meetingsWithScores),
        }
      : {
          averageModuleScore: 0,
          averageQuizScore: 0,
          averageTaskScore: 0,
          averageTotalScore: 0,
        };

  return {
    trainingId: trainingWithScores.id,
    trainingTitle: trainingWithScores.title,
    trainingDescription: trainingWithScores.description,
    averageScores,
    meetings: meetingsScores,
  };
};

export default { getScore, getTrainingScores };
