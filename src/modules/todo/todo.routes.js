import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import {
  createTodoController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController,
  getAllTodosController,
  clearCompletedTodosController,
} from "./todo.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Create a new intention
router.post("/", createTodoController);

// Clear all completed intentions
router.delete("/completed", clearCompletedTodosController);
// Get all intentions for the logged-in user
router.get("/", getAllTodosController);

// Get a single intention by ID
router.get("/:todoId", getSingleTodoController);

// Update an intention (e.g., mark as completed, change horizon)
router.patch("/:todoId", updateTodoController);

// Delete an intention
router.delete("/:todoId", deleteTodoController);

export default router;
