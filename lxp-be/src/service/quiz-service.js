import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createQuizValidation,
  deleteQuizValidation,
  getDetailQuizValidation,
  getInstructorDetailQuizValudation,
  submitQuizValidation,
  updateQuizValidation,
} from "../validation/quiz-validation.js";
import { validate } from "../validation/validation.js";
import trainingService from "./training-service.js";

const createQuiz = async (user, meetingId, request) => {
  const quiz = validate(createQuizValidation, request);

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

  return prismaClient.quiz.create({
    data: {
      title: quiz.title,
      meetingId: meetingId,
      questions: quiz.questions, // This will be stored as JSON
    },
    select: {
      id: true,
      title: true,
      questions: true,
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

const submitQuiz = async (user, quizId, request) => {
  const { answers } = validate(submitQuizValidation, request);

  // Check if the quiz exists
  const quiz = await prismaClient.quiz.findUnique({
    where: { id: quizId },
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

  if (!quiz) {
    throw new ResponseError(404, "Quiz not found");
  }

  if (quiz.meeting.training.users.length === 0) {
    throw new ResponseError(403, "You are not enrolled in this training");
  }

  // Get trainingUserId
  const trainingUser = quiz.meeting.training.users[0];
  const trainingUserId = trainingUser.id;

  const questions = quiz.questions;
  
  if (!questions || questions.length === 0) {
    throw new ResponseError(400, "Quiz has no questions");
  }

  const scorePerQuestion = 100 / questions.length;
  let quizScore = 0;

  // Calculate score
  answers.forEach((answer) => {
    const question = questions[answer.questionIndex];
    if (question && question.correctAnswer === answer.selectedAnswer) {
      quizScore += scorePerQuestion;
    }
  });

  quizScore = Math.round(quizScore);

  return prismaClient.$transaction(async (tx) => {
    let submission = await tx.quizSubmission.findFirst({
      where: { quizId: quizId, trainingUserId: trainingUserId },
    });

    if (submission) {
      submission = await tx.quizSubmission.update({
        where: { id: submission.id },
        data: {
          answers: answers,
          score: quizScore,
          updatedAt: new Date(),
        },
      });
    } else {
      submission = await tx.quizSubmission.create({
        data: {
          quizId: quizId,
          trainingUserId: trainingUserId,
          answers: answers,
          score: quizScore,
        },
      });
    }

    // Update score table
    const existingScore = await tx.score.findFirst({
      where: {
        trainingUserId: trainingUserId,
        meetingId: quiz.meetingId,
      },
    });

    if (existingScore) {
      const totalScore = Math.round(
        (existingScore.moduleScore + quizScore + existingScore.taskScore) / 3
      );
      
      await tx.score.update({
        where: { id: existingScore.id },
        data: {
          quizScore: quizScore,
          totalScore: totalScore,
          updatedAt: new Date(),
        },
      });
    } else {
      await tx.score.create({
        data: {
          trainingUserId: trainingUserId,
          meetingId: quiz.meetingId,
          quizScore: quizScore,
          totalScore: Math.round(quizScore / 3),
        },
      });
    }

    // Check and update training completion status
    const isCompleted = await trainingService.checkAndUpdateTrainingCompletion(trainingUserId, tx);

    return {
      id: quiz.id,
      title: quiz.title,
      meetingId: quiz.meetingId,
      submission: {
        id: submission.id,
        trainingUserId: submission.trainingUserId,
        answers: submission.answers,
        score: quizScore,
      },
      trainingCompleted: isCompleted, // Add this to response
      meeting: {
        id: quiz.meeting.id,
        title: quiz.meeting.title,
        training: {
          id: quiz.meeting.training.id,
          title: quiz.meeting.training.title,
        },
      },
      createdAt: quiz.createdAt,
      updatedAt: new Date(),
    };
  });
};
const getDetailQuiz = async (user, request) => {
  const validationResult = validate(getDetailQuizValidation, request);
  const { meetingId, quizId } = validationResult;

  const quiz = await prismaClient.quiz.findFirst({
    where: {
      id: quizId,
      meetingId: meetingId,
      meeting: {
        training: {
          users: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
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

  if (!quiz) {
    throw new ResponseError(
      404,
      "Quiz not found or you're not enrolled in this training"
    );
  }

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

  const quizSubmission = await prismaClient.quizSubmission.findFirst({
    where: {
      quizId: quizId,
      trainingUserId: trainingUser.id,
    },
    select: {
      score: true,
    },
  });

  return {
    ...quiz,
    submission: quizSubmission || { score: 0 },
  };
};

const getQuizQuestions = async (user, request) => {
  const validationResult = validate(getDetailQuizValidation, request);
  const { meetingId, quizId } = validationResult;

  // Find the training user record
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
      status: "enrolled", // Ensure user is still enrolled
    },
  });

  if (!trainingUser) {
    throw new ResponseError(
      403,
      "You are not enrolled in this training or the training is not active"
    );
  }

  const quiz = await prismaClient.quiz.findFirst({
    where: {
      id: quizId,
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
      questions: true,
      meeting: {
        select: {
          id: true,
          title: true,
          meetingDate: true,
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

  if (!quiz) {
    throw new ResponseError(
      404,
      "Quiz not found or you're not enrolled in this training"
    );
  }

  // Transform questions to remove correctAnswer for security
  const questionsForStudent = quiz.questions.map((question) => ({
    question: question.question,
    options: question.options,
  }));

  return {
    id: quiz.id,
    title: quiz.title,
    trainingUserId: trainingUser.id, // Include trainingUserId
    questions: questionsForStudent,
    meeting: quiz.meeting,
  };
};

const getInstructorDetailQuiz = async (user, request) => {
  const validationResult = validate(getInstructorDetailQuizValudation, request);
  const { trainingId, meetingId, quizId } = validationResult;

  const quiz = await prismaClient.quiz.findFirst({
    where: {
      id: quizId,
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
      questions: true,
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

  if (!quiz) {
    throw new ResponseError(
      404,
      "Quiz not found or you're not the instructor in this training"
    );
  }

  return quiz;
};

const updateQuiz = async (user, request) => {
  const quiz = validate(updateQuizValidation, request);
  const { trainingId, meetingId, quizId, title, questions } = quiz;

  const existingQuiz = await prismaClient.quiz.findUnique({
    where: {
      id: quizId,
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

  if (!existingQuiz) {
    throw new ResponseError(404, "Quiz not found");
  }

  if (
    existingQuiz.meeting.training.id !== trainingId ||
    existingQuiz.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to update this quiz"
    );
  }

  console.log(title);
  console.log(questions);

  return prismaClient.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      title: title,
      questions: questions, // Changed from question to questions
    },
    select: {
      id: true,
      title: true,
      questions: true,
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

const deleteQuiz = async (user, request) => {
  const quiz = validate(deleteQuizValidation, request);
  const { trainingId, meetingId, quizId } = quiz;

  const existingQuiz = await prismaClient.quiz.findUnique({
    where: {
      id: quizId,
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

  if (!existingQuiz) {
    throw new ResponseError(404, "Module not found");
  }

  // Validate that training matches and user is the instructor
  if (
    existingQuiz.meeting.training.id !== trainingId ||
    existingQuiz.meeting.training.instructorId !== user.id
  ) {
    throw new ResponseError(
      403,
      "You don't have permission to delete this quiz"
    );
  }

  return prismaClient.$transaction(async (tx) => {
    // Get module submissions and group them by user to update scores
    const submissions = await tx.quizSubmission.findMany({
      where: { quizId: quizId },
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
    await tx.quizSubmission.deleteMany({
      where: { quizId: quizId },
    });

    // Update only quizScore for each affected user
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
          // Only update quizScore, leave totalScore unchanged
          await tx.score.update({
            where: { id: userScore.id },
            data: {
              quizScore: Math.max(0, userScore.quizScore - scoreToReduce),
            },
          });
        }
      }
    }

    // Delete the quiz
    return tx.quiz.delete({
      where: {
        id: quizId,
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
  createQuiz,
  submitQuiz,
  getDetailQuiz,
  getQuizQuestions,
  getInstructorDetailQuiz,
  updateQuiz,
  deleteQuiz,
};
