import {
  createTodo,
  updateTodoById,
  deleteTodoById,
} from "./todo.repository.js";

import { getOwnedTodoOrThrow } from "./todo.authorization.js";

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

export {
  createTodoService,
  getSingleTodoService,
  updateTodoService,
  deleteTodoService,
};
