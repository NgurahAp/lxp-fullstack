import Joi from "joi";

const createQuizValidation = Joi.object({
  title: Joi.string().max(255).required(),
  quizScore: Joi.number().min(0).default(0),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).max(4).required(),
        correctAnswer: Joi.number().min(0).max(3).required(), // index of correct answer
        score: Joi.number().min(0).default(0),
      })
    )
    .min(1)
    .required(),
});

const submitQuizValidation = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionIndex: Joi.number().min(0).required(),
        selectedAnswer: Joi.number().min(0).max(3).required(),
      })
    )
    .min(1)
    .required(),
});

const getDetailQuizValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
  quizId: Joi.number().positive().required(),
});

export { createQuizValidation, submitQuizValidation, getDetailQuizValidation };
