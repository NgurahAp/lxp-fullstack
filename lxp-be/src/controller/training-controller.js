import trainingService from "../service/training-service.js";

const createTraining = async (req, res, next) => {
  try {
    const result = await trainingService.createTraining(req.user, req.body);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createTrainingUser = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await trainingService.createTrainingUser(request);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getStudentsTraining = async (req, res, next) => {
  try {
    const result = await trainingService.getStudentTrainings(
      req.user,
      req.query
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export default { createTraining, createTrainingUser, getStudentsTraining };
