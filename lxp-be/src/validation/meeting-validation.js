import Joi from "joi";

const createMeetingValidation = Joi.object({
  trainingId: Joi.number().positive().required(),
  title: Joi.string().max(255).required(),
  meetingDate: Joi.date().iso().allow(null).optional(),
});

const getMeetingValidation = Joi.object({
  trainingId: Joi.number().positive().required(),
  page: Joi.number().min(1).default(1),
  size: Joi.number().min(1).max(50).default(10),
});

const getMeetingDetailValidation = Joi.object({
  trainingId: Joi.number().positive().required(),
  meetingId: Joi.number().positive().required(),
});

export { createMeetingValidation, getMeetingValidation, getMeetingDetailValidation };
