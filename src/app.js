import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import v1Routes from "./routes/v1/index.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { mediaRoutes } from "./modules/media/media.routes.js";
import todoRoutes from "./modules/todo/todo.routes.js";
import { env } from "./config/env.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://journal-app-backend-69ps.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1", v1Routes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use(helmet());
app.use(morgan("dev"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;
