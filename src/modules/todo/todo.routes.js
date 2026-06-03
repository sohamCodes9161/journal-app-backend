import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import {
  createTodoController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController,
  getAllTodosController,
} from "./todo.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createTodoController);

router.get("/", getAllTodosController);

router.get("/:todoId", getSingleTodoController);

router.patch("/:todoId", updateTodoController);

router.delete("/:todoId", deleteTodoController);

export default router;
