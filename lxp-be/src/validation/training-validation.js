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

export { createTrainingUserValidation, createTrainingValidation };
