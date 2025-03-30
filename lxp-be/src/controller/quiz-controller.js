import quizService from "../service/quiz-service.js";

const createQuiz = async (req, res, next) => {
  try {
    const meetingId = req.params.meetingId;
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
    const quizId = req.params.quizId;
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
    const meetingId = req.params.meetingId;
    const quizId = req.params.quizId;

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
    const meetingId = req.params.meetingId;
    const quizId = req.params.quizId;

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

const updateQuiz = async (req, res, next) => {
  try {
    const result = await quizService.updateQuiz(
      req.user,
      {
        trainingId: req.params.trainingId,
        meetingId: req.params.meetingId,
        quizId: req.params.quizId, // Added quizId parameter
        title: req.body.title,
        questions: req.body.questions, // Added questions field
      },
      req.body
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    await quizService.deleteQuiz(req.user, {
      trainingId: req.params.trainingId,
      meetingId: req.params.meetingId,
      quizId: req.params.quizId,
    });
    res.status(200).json({
      data: "Success delete quiz",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createQuiz,
  submitQuiz,
  getQuizDetail,
  getQuizQuestions,
  updateQuiz,
  deleteQuiz,
};
