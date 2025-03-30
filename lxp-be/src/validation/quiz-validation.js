import Joi from "joi";

const createQuizValidation = Joi.object({
  title: Joi.string().max(255).required(),
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
        selectedAnswer: Joi.number().min(0).max(3),
      })
    )
    .min(1)
    .required(),
  trainingUserId: Joi.string().required(),
});

const getDetailQuizValidation = Joi.object({
  meetingId: Joi.string().required(),
  quizId: Joi.string().required(),
});

const updateQuizValidation = Joi.object({
  trainingId: Joi.string().required(),
  meetingId: Joi.string().required(),
  quizId: Joi.string().required(),
  title: Joi.string().max(255),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).max(4).required(),
        correctAnswer: Joi.number().min(0).max(3).required(),
        score: Joi.number().min(0).default(0),
      })
    )
    .min(1),
});

const deleteQuizValidation = Joi.object({
  trainingId: Joi.string().required(),
  meetingId: Joi.string().required(),
  quizId: Joi.string().required(),
});

export {
  createQuizValidation,
  submitQuizValidation,
  getDetailQuizValidation,
  updateQuizValidation,
  deleteQuizValidation,
};
