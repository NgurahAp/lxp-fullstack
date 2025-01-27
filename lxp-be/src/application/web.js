import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";

const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(errorMiddleware);

export { web };
