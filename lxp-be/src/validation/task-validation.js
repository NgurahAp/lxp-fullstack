import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().max(255).required(),
  taskQuestion: Joi.string().max(255).required(),
  taskScore: Joi.number().min(0).default(0),
});

const getDetailTaskValidation = Joi.object({
  meetingId: Joi.string().required(),
  taskId: Joi.string().required(),
});

const submitScoreTaskValidation = Joi.object({
  taskScore: Joi.number().required(),
});

export {
  createTaskValidation,
  getDetailTaskValidation,
  submitScoreTaskValidation,
};
