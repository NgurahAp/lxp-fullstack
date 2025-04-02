import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().max(255).required(),
  taskQuestion: Joi.string().max(255).required(),
});

const getDetailTaskValidation = Joi.object({
  meetingId: Joi.string().required(),
  taskId: Joi.string().required(),
});

const getInstructorDetailTaskValidation = Joi.object({
  trainingId: Joi.string().required(),
  meetingId: Joi.string().required(),
  taskId: Joi.string().required(),
});

const submitScoreTaskValidation = Joi.object({
  taskScore: Joi.number().min(0).max(100).required(),
  trainingUserId: Joi.string().required(),
});

const updateTaskValidation = Joi.object({
  trainingId: Joi.string().required(),
  meetingId: Joi.string().required(),
  taskId: Joi.string().required(),
  title: Joi.string().max(255),
  taskQuestion: Joi.string().max(255),
});

const deleteTaskValidation = Joi.object({
  trainingId: Joi.string().required(),
  meetingId: Joi.string().required(),
  taskId: Joi.string().required(),
});

export {
  createTaskValidation,
  getDetailTaskValidation,
  submitScoreTaskValidation,
  getInstructorDetailTaskValidation,
  updateTaskValidation,
  deleteTaskValidation,
};
