import quizService from "../service/quiz-service.js";

const createQuiz = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const result = await quizService.createQuiz(req.user, meetingId, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { createQuiz };
