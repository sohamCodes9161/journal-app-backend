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

const getTodos = async (filters, options) => {
  const { page, limit, sort } = options;

  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    Todo.find(filters).sort(sort).skip(skip).limit(limit),

    Todo.countDocuments(filters),
  ]);

  return {
    todos,
    total,
  };
};

export { createTodo, findTodoById, updateTodoById, deleteTodoById, getTodos };
