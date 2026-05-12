import { Router } from "express";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
const router = Router();

router.get("/health", (req, res) => {
    res.json(new ApiResponse(200, { status: "OK" }, "Health check passed"));
});

export default router;
