import trainingService from "../service/training-service.js";

const createTraining = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await trainingService.createTraining(request);

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

export default { createTraining, createTrainingUser };
