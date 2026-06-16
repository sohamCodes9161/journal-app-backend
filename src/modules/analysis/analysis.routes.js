import express from "express";
import { getWorkspaceAnalytics } from "./analysis.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

// Endpoint Route Vector: GET /api/analysis?range=week
router.get("/", authMiddleware, getWorkspaceAnalytics);

export default router;
