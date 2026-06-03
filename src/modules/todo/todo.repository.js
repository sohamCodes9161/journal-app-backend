import Todo from "./todo.model.js";

const createTodo = async (todoData) => {
  return await Todo.create(todoData);
};

const findTodoById = async (todoId) => {
  return await Todo.findById(todoId);
};

const updateTodoById = async (todoId, updateData) => {
  return await Todo.findByIdAndUpdate(todoId, updateData, {
    new: true,
  });
};

const deleteTodoById = async (todoId) => {
  return await Todo.findByIdAndDelete(todoId);
};

export { createTodo, findTodoById, updateTodoById, deleteTodoById };
