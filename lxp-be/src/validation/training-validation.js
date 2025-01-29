import Joi from "joi";

const createTrainingValidation = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  instructorId: Joi.number().positive().required(),
});

const createTrainingUserValidation = Joi.object({
  trainingId: Joi.number().positive().required(),
  userId: Joi.number().positive().required(),
  status: Joi.string()
    .valid("enrolled", "completed", "dropped")
    .default("enrolled"),
});

const getStudentTrainingsValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  size: Joi.number().min(1).max(50).default(10),
  status: Joi.number().valid("enrolled", "completed", "dropped").optional(),
});

export {
  createTrainingUserValidation,
  createTrainingValidation,
  getStudentTrainingsValidation,
};
