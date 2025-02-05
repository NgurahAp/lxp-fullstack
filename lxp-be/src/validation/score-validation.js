import Joi from "joi";

const getScoreValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
});

export {getScoreValidation}