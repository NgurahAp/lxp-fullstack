import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import trainingController from "../controller/training-controller.js";
import userController from "../controller/user-controller.js";
import { instruktorMiddleware } from "../middleware/instructor-middleware.js";
import meetingController from "../controller/meeting-controller.js";
import moduleController from "../controller/module-controller.js";
import quizController from "../controller/quiz-controller.js";
import taskController from "../controller/task-controller.js";
import scoreController from "../controller/score-controller.js";

const userRouter = express.Router();

// Router for user
userRouter.get("/api/users/current", authMiddleware, userController.get);
userRouter.delete("/api/users/logout", authMiddleware, userController.logout);

// Router for training
userRouter.post(
  "/api/trainings",
  authMiddleware,
  instruktorMiddleware,
  trainingController.createTraining
);

userRouter.post(
  "/api/training-users",
  authMiddleware,
  trainingController.createTrainingUser
);
userRouter.get(
  "/api/student/trainings",
  authMiddleware,
  trainingController.getStudentsTraining
);
userRouter.get(
  "/api/student/trainings/:trainingId",
  authMiddleware,
  trainingController.getTrainingDetail
);

// Router for meeting
userRouter.post(
  "/api/meetings",
  authMiddleware,
  instruktorMiddleware,
  meetingController.createMeeting
);
userRouter.get(
  "/api/trainings/:trainingId/meetings",
  authMiddleware,
  meetingController.getMeetings
);
userRouter.get(
  "/api/trainings/:trainingId/meetings/:meetingId",
  authMiddleware,
  meetingController.getMeetingDetail
);

// Router for module
userRouter.post(
  "/api/meetings/:meetingId/modules",
  authMiddleware,
  instruktorMiddleware,
  moduleController.createModule
);
userRouter.post(
  "/api/modules/:moduleId/answer",
  authMiddleware,
  moduleController.submitModuleAnswer
);
userRouter.get(
  "/api/meetings/:meetingId/modules",
  authMiddleware,
  moduleController.getModules
);
userRouter.get(
  "/api/meetings/:meetingId/modules/:moduleId",
  authMiddleware,
  moduleController.getModuleDetail
);
userRouter.post(
  "/api/modules/:moduleId/score",
  authMiddleware,
  instruktorMiddleware,
  moduleController.submitModuleScore
);

// Router for Quiz
userRouter.post(
  "/api/meetings/:meetingId/quizzes",
  authMiddleware,
  instruktorMiddleware,
  quizController.createQuiz
);
userRouter.post(
  "/api/quizzes/:quizId/submit",
  authMiddleware,
  quizController.submitQuiz
);
userRouter.get(
  "/api/meetings/:meetingId/quizzes/:quizId",
  authMiddleware,
  quizController.getQuizDetail
);
userRouter.get(
  "/api/meetings/:meetingId/quizzes/:quizId/questions",
  authMiddleware,
  quizController.getQuizQuestions
);

// Route for Task
userRouter.post(
  "/api/meetings/:meetingId/tasks",
  authMiddleware,
  instruktorMiddleware,
  taskController.createTask
);
userRouter.post(
  "/api/tasks/:taskId/submit",
  authMiddleware,
  taskController.submitTask
);
userRouter.get(
  "/api/meetings/:meetingId/tasks/:taskId",
  authMiddleware,
  taskController.getTaskDetail
);
userRouter.post(
  "/api/tasks/:taskId/score",
  authMiddleware,
  instruktorMiddleware,
  taskController.submitTaskScore
);

// Route for score
userRouter.get(
  "/api/meetings/:meetingId/scores",
  authMiddleware,
  scoreController.getScoreDetail
);
userRouter.get(
  "/api/trainings/:trainingId/score",
  authMiddleware,
  scoreController.getTrainingScores
);

export { userRouter };
