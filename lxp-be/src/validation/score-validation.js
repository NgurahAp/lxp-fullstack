import Joi from "joi";

const getScoreValidation = Joi.object({
  meetingId: Joi.string().required(),
});

const getTrainingScoresValidation = Joi.object({
  trainingId: Joi.string().required(),
});

export { getScoreValidation, getTrainingScoresValidation };
