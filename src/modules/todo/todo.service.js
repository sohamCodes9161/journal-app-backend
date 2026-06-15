import Todo from "./todo.model.js"; // Fallback direct call for bulk operations
import ApiError from "../../utils/ApiError.js";
import {
  createTodoRepo,
  findTodosByUserIdRepo,
  updateTodoRepo,
  deleteTodoRepo,
  findTodoByIdRepo,
} from "./todo.repository.js";

export const createTodoService = async (todoData, userId) => {
  if (!todoData.title || todoData.title.trim() === "") {
    throw new ApiError(400, "Intention title cannot be empty");
  }

  const newTodo = {
    ...todoData,
    userId,
    status: "pending",
    completedAt: null,
  };

  return await createTodoRepo(newTodo);
};

export const getAllTodosService = async (userId) => {
  // We don't need req.query right now because our minimal app fetches all
  // active tasks for the user and the frontend groups them by horizonType.
  return await findTodosByUserIdRepo(userId);
};

export const getSingleTodoService = async (todoId, userId) => {
  const todo = await findTodoByIdRepo(todoId, userId);
  if (!todo) {
    throw new ApiError(404, "Intention not found");
  }
  return todo;
};

export const updateTodoService = async (todoId, updateData, userId) => {
  // Auto-manage the completedAt timestamp
  if (updateData.status === "completed") {
    updateData.completedAt = new Date();
  } else if (updateData.status === "pending") {
    updateData.completedAt = null;
  }

  const updatedTodo = await updateTodoRepo(todoId, userId, updateData);

  if (!updatedTodo) {
    throw new ApiError(404, "Intention not found or unauthorized");
  }

  return updatedTodo;
};

export const deleteTodoService = async (todoId, userId) => {
  const deletedTodo = await deleteTodoRepo(todoId, userId);

  if (!deletedTodo) {
    throw new ApiError(404, "Intention not found or unauthorized");
  }

  return deletedTodo;
};

// Append this function to your existing service file
export const clearCompletedTodosService = async (userId) => {
  const result = await Todo.deleteMany({ userId, status: "completed" });
  return { deletedCount: result.deletedCount };
};
