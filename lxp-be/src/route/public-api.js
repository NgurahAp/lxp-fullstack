import exress from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new exress.Router();
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.post("/api/users/forgetPassword", userController.resetToken);
publicRouter.post(
  "/api/users/resetPassword/:token",
  userController.resetPassword
);

export { publicRouter };
