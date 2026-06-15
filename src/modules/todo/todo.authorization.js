import ApiError from "../../utils/ApiError.js";

import { findTodosByUserIdRepo } from "./todo.repository.js";

const getOwnedTodoOrThrow = async (todoId, userId) => {
  const todo = await findTodosByUserIdRepo(userId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (todo.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  return todo;
};

export { getOwnedTodoOrThrow };
