import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createTodoService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService,
  getAllTodosService,
  clearCompletedTodosService,
} from "./todo.service.js"; // Adjust path as necessary

const createTodoController = asyncHandler(async (req, res) => {
  const todo = await createTodoService(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Intention created successfully"));
});

const getSingleTodoController = asyncHandler(async (req, res) => {
  const todo = await getSingleTodoService(req.params.todoId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Intention fetched successfully"));
});

const updateTodoController = asyncHandler(async (req, res) => {
  const todo = await updateTodoService(
    req.params.todoId,
    req.body,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Intention updated successfully"));
});

const deleteTodoController = asyncHandler(async (req, res) => {
  await deleteTodoService(req.params.todoId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Intention deleted successfully"));
});

const getAllTodosController = asyncHandler(async (req, res) => {
  // Passing req.user._id to fetch all intentions for the logged-in user
  const data = await getAllTodosService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Intentions fetched successfully"));
});

const clearCompletedTodosController = asyncHandler(async (req, res) => {
  const report = await clearCompletedTodosService(req.user._id);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        report,
        `${report.deletedCount} fulfilled intentions swept clean ✨`
      )
    );
});
export {
  createTodoController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController,
  getAllTodosController,
  clearCompletedTodosController,
};
