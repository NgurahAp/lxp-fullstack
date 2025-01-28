import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import trainingController from "../controller/training-controller.js";

const trainingRouter = express.Router();

trainingRouter.post(
  "/api/trainings",
  authMiddleware,
  trainingController.createTraining
);

trainingRouter.post(
  "/api/training-users",
  authMiddleware,
  trainingController.createTrainingUser
);

export { trainingRouter };
