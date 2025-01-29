import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import trainingController from "../controller/training-controller.js";
import userController from "../controller/user-controller.js";

const userRouter = express.Router();

// Router for user
userRouter.get("/api/users/current", authMiddleware, userController.get);

// Router for traininig
userRouter.post(
  "/api/trainings",
  authMiddleware,
  trainingController.createTraining
);
userRouter.post(
  "/api/training-users",
  authMiddleware,
  trainingController.createTrainingUser
);

export { userRouter };
