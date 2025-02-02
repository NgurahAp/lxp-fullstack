import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createQuizValidation,
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
      quizScore: true,
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
  const submittedAnswers = validate(submitQuizValidation, request);

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
  submittedAnswers.answers.forEach((answer) => {
    const question = questions[answer.questionIndex];
    if (question && question.correctAnswer === answer.selectedAnswer) {
      quizScore += scorePerQuestion;
    }
  });

  // Round the score to nearest integer
  quizScore = Math.round(quizScore);

  // Update quiz score
  await prismaClient.quiz.update({
    where: { id: quizId },
    data: { quizScore: quizScore },
  });

  return {
    quizId: quiz.id,
    title: quiz.title,
    score: quizScore,
    totalQuestions: questions.length,
  };
};

export default { createQuiz, submitQuiz };
