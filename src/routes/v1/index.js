import { Router } from "express";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import authRoutes from "../../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/health", (req, res) => {
    res.json(new ApiResponse(200, { status: "OK" }, "Health check passed"));
});

export default router;
