import {
  createTodo,
  updateTodoById,
  deleteTodoById,
  getTodos,
} from "./todo.repository.js";

import { getOwnedTodoOrThrow } from "./todo.authorization.js";
import { buildTodoQuery } from "./todo.query.js";
const createTodoService = async (todoData, userId) => {
  const todo = await createTodo({
    ...todoData,
    userId,
  });

  return todo;
};

const getSingleTodoService = async (todoId, userId) => {
  return await getOwnedTodoOrThrow(todoId, userId);
};

const updateTodoService = async (todoId, updateData, userId) => {
  await getOwnedTodoOrThrow(todoId, userId);

  const updatedFields = {
    ...updateData,
  };

  if (updateData.status === "completed") {
    updatedFields.completedAt = new Date();

    updatedFields.progressPercentage = 100;
  }

  const updatedTodo = await updateTodoById(todoId, updatedFields);

  return updatedTodo;
};

const deleteTodoService = async (todoId, userId) => {
  await getOwnedTodoOrThrow(todoId, userId);

  await deleteTodoById(todoId);
};

const getAllTodosService = async (query, userId) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const sortBy = query.sortBy || "createdAt";

  const sortType = query.sortType === "asc" ? 1 : -1;

  const filters = buildTodoQuery(query);

  filters.userId = userId;

  const result = await getTodos(filters, {
    page,
    limit,
    sort: {
      [sortBy]: sortType,
    },
  });

  return {
    todos: result.todos,

    pagination: {
      total: result.total,

      page,

      limit,

      totalPages: Math.ceil(result.total / limit),
    },
  };
};

export {
  createTodoService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService,
  getAllTodosService,
};
