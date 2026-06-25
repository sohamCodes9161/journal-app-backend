import { Router } from "express";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import authRoutes from "../../modules/auth/auth.routes.js";
import journalRoutes from "../../modules/journal/journal.routes.js";
import analyticsRoutes from "../../modules/analysis/analysis.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(
    new ApiResponse({
      message: "Welcome to the Journal App API",
      data: {
        version: "1.0.0",
        routes: [
          {
            path: "/auth",
            description: "Authentication routes",
          },
          {
            path: "/journals",
            description: "Journal routes",
          },
          {
            path: "/analytics",
            description: "Analytics routes",
          },
        ],
      },
    })
  );
});

router.use("/auth", authRoutes);
router.use("/journals", journalRoutes);

router.use("/analytics", analyticsRoutes);

export default router;
