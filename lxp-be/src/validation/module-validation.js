import Joi from "joi";

const createModuleValidation = Joi.object({
  title: Joi.string().max(255).required(),
});

const submitModuleAnswerValidation = Joi.object({
  answer: Joi.string().required(),
});

const getModulesValidation = Joi.object({
  meetingId: Joi.string().required(),
  page: Joi.number().positive().default(1),
  size: Joi.number().positive().min(1).max(100).default(10),
});

const getDetailModuleValidation = Joi.object({
  meetingId: Joi.string().required(),
  moduleId: Joi.string().required(),
});

const submitScoreModuleValidation = Joi.object({
  moduleScore: Joi.number().required(),
});

export {
  createModuleValidation,
  submitModuleAnswerValidation,
  getModulesValidation,
  getDetailModuleValidation,
  submitScoreModuleValidation,
};
