import Joi from "joi";

const getStudentsValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  size: Joi.number().min(1).max(50).default(10),
  status: Joi.number().valid("enrolled", "completed", "dropped").optional(),
});

const getDetailStudentValidation = Joi.object({
  studentId: Joi.string().required(),
});

export { getStudentsValidation, getDetailStudentValidation };
