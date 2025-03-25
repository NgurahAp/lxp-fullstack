import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createQuizValidation,
  getDetailQuizValidation,
  submitQuizValidation,
} from "../validation/quiz-validation.js";
import { validate } from "../validation/validation.js";

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
  const { answers, trainingUserId } = validate(submitQuizValidation, request);

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

  // Check if user is enrolled in the training
  if (quiz.meeting.training.users.length === 0) {
    throw new ResponseError(403, "You are not enrolled in this training");
  }

  const questions = quiz.questions;
  const scorePerQuestion = 100 / questions.length;
  let quizScore = 0;

  // Calculate score based on correct answers
  answers.forEach((answer) => {
    const question = questions[answer.questionIndex];
    if (question && question.correctAnswer === answer.selectedAnswer) {
      quizScore += scorePerQuestion;
    }
  });

  // Round the score to nearest integer
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

    const existingScore = await tx.score.findFirst({
      where: {
        trainingUserId: trainingUserId,
        meetingId: quiz.meetingId,
      },
    });

    if (existingScore) {
      await tx.score.update({
        where: {
          id: existingScore.id,
        },
        data: {
          quizScore: quizScore,
          totalScore: Math.round(
            (existingScore.moduleScore +
              quizScore +
              (existingScore.taskScore || 0)) /
              3
          ),
        },
      });
    } else {
      await tx.score.create({
        data: {
          trainingUserId: trainingUserId,
          meetingId: quiz.meetingId,
          quizScore: quizScore,
          totalScore: Math.round(quizScore / 3), // default calculation
        },
      });
    }

    return {
      id: quiz.id,
      title: quiz.title,
      meetingId: quiz.meetingId,
      submission: {
        id: submission.id,
        trainingUserId: submission.trainingUserId,
        score: quizScore,
      },
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
              status: "enrolled",
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

export default { createQuiz, submitQuiz, getDetailQuiz, getQuizQuestions };
