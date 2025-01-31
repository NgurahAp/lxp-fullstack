import Joi from "joi";

const createModuleValidation = Joi.object({
  title: Joi.string().max(255).required(),
  moduleScore: Joi.number().min(0).default(0),
});

const submitModuleAnswerValidation = Joi.object({
  moduleAnswer: Joi.string().required(),
});

const getModulesValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
  page: Joi.number().positive().default(1),
  size: Joi.number().positive().min(1).max(100).default(10),
});

const getDetailModuleValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
  moduleId: Joi.number().positive().required(),
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
