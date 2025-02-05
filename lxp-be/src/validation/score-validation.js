import Joi from "joi";

const getScoreValidation = Joi.object({
  meetingId: Joi.number().positive().required(),
});

const getTrainingScoresValidation = Joi.object({
  trainingId: Joi.number().positive().required(),
});

export {getScoreValidation, getTrainingScoresValidation}