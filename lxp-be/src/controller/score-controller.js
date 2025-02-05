import scoreService from "../service/score-service.js";

const getScoreDetail = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId);

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

export default { getScoreDetail };
