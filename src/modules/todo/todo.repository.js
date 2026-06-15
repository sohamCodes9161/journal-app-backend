import Todo from "./todo.model.js";

export const createTodoRepo = async (data) => {
  return await Todo.create(data);
};

export const findTodosByUserIdRepo = async (userId) => {
  return await Todo.find({ userId }).sort({
    horizonType: 1,
    position: 1,
    createdAt: -1,
  });
};

export const findTodoByIdRepo = async (todoId, userId) => {
  return await Todo.findOne({ _id: todoId, userId });
};

export const updateTodoRepo = async (todoId, userId, updateData) => {
  return await Todo.findOneAndUpdate(
    { _id: todoId, userId },
    { $set: updateData },
    { new: true }
  );
};

export const deleteTodoRepo = async (todoId, userId) => {
  return await Todo.findOneAndDelete({ _id: todoId, userId });
};
