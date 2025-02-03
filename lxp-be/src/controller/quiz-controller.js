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

const submitQuiz = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const result = await quizService.submitQuiz(req.user, quizId, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getQuizDetail = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const quizId = parseInt(req.params.quizId);

    const result = await quizService.getDetailQuiz(req.user, {
      meetingId,
      quizId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getQuizQuestions = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const quizId = parseInt(req.params.quizId);

    const result = await quizService.getQuizQuestions(req.user, {
      meetingId,
      quizId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { createQuiz, submitQuiz, getQuizDetail, getQuizQuestions };
