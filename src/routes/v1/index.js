import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        sucess: true,
        message: "Server is healthy"
    });
});

export default router;
