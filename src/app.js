import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import v1Routes from "./routes/v1/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", v1Routes);
app.use(helmet());
app.use(morgan("dev"));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found" ,
    });
});


export default app;