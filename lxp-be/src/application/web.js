import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { userRouter } from "../route/api.js";
import cors from "cors";

const web = express();

web.use(
  cors({
    origin: "http://localhost:5173", // Origin dari aplikasi React Anda
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Jika Anda menggunakan cookies/credentials
  })
);

// Digunakan agar FE bisa mengakses file public yang ada di BE
web.use("/public", express.static("public"));


// 1. Middleware untuk parsing JSON
web.use(express.json());
// 2. Routers
web.use(publicRouter);
web.use(userRouter);

// 3. Error middleware harus TERAKHIR
web.use(errorMiddleware);

export { web };
