import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import trainingController from "../controller/training-controller.js";
import userController from "../controller/user-controller.js";
import { instruktorMiddleware } from "../middleware/instructor-middleware.js";
import meetingController from "../controller/meeting-controller.js";

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

export { userRouter };
