import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import {
  createTodoService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService,
} from "./todo.service.js";

const createTodoController = asyncHandler(async (req, res) => {
  const todo = await createTodoService(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

const getSingleTodoController = asyncHandler(async (req, res) => {
  const todo = await getSingleTodoService(req.params.todoId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

const updateTodoController = asyncHandler(async (req, res) => {
  const todo = await updateTodoService(
    req.params.todoId,
    req.body,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

const deleteTodoController = asyncHandler(async (req, res) => {
  await deleteTodoService(req.params.todoId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo deleted successfully"));
});

export {
  createTodoController,
  getSingleTodoController,
  updateTodoController,
  deleteTodoController,
};
