import Joi from "joi";

const createModuleValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
  title: Joi.string().max(255).required(),
  moduleScore: Joi.number().min(0).default(0),
});

export { createModuleValidation };
