import express from "express";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../route/public-api";

const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(errorMiddleware);

export { web };
