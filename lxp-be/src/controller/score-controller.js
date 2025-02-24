import scoreService from "../service/score-service.js";

const getScoreDetail = async (req, res, next) => {
  try {
    const meetingId = (req.params.meetingId);

    const result = await scoreService.getScore(req.user, {
      meetingId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getTrainingScores = async (req, res, next) => {
  try {
    const trainingId = (req.params.trainingId);

    const result = await scoreService.getTrainingScores(req.user, {
      trainingId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { getScoreDetail, getTrainingScores };
