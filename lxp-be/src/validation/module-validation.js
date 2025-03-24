import Joi from "joi";

const createModuleValidation = Joi.object({
  title: Joi.string().max(255).required(),
});

const submitModuleAnswerValidation = Joi.object({
  answer: Joi.string().required(),
});

const getDetailModuleValidation = Joi.object({
  meetingId: Joi.string().required(),
  moduleId: Joi.string().required(),
});

const submitScoreModuleValidation = Joi.object({
  moduleScore: Joi.number().min(0).max(100).required(),
  trainingUserId: Joi.string().required(),
});

export {
  createModuleValidation,
  submitModuleAnswerValidation,
  getDetailModuleValidation,
  submitScoreModuleValidation,
};
