import axiosInstance from "../api/axiosInstance";

const TodoService = () => {
  // -- Checklist API -- //
  const addTodo = async (payload) => {
    const { data } = await axiosInstance.post("/checklist", payload);
    return data;
  };

  const getAllTodo = async () => {
    const { data } = await axiosInstance.get(`/checklist`);
    return data;
  };

  const removeTodoById = async (id) => {
    const { data } = await axiosInstance.delete(`/checklist/${id}`);
    return data;
  };
  // -- Checklist API -- //

  // -- Checklist Item API -- //
  const addTodoItemById = async (payload) => {
    const { data } = await axiosInstance.post(
      `/checklist/${payload.id}/item`,
      payload
    );
    return data;
  };
  const getTodoItemByTodoId = async (todo_id) => {
    const { data } = await axiosInstance.get(`/checklist/${todo_id}/item`);
    return data;
  };

  const renameTodoItemById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/checklist/${payload.todo_id}/item/rename/${payload.id}`,
      payload
    );
    return data;
  };

  const updateStatusTodoItemById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/checklist/${payload.todo_id}/item/${payload.id}`
    );
    return data;
  };

  const removeTodoItemById = async (payload) => {
    const { data } = await axiosInstance.delete(
      `/checklist/${payload.todo_id}/item/${payload.id}`
    );
    return data;
  };
  // -- Checklist Item API -- //

  return {
    addTodo,
    getAllTodo,
    removeTodoById,
    addTodoItemById,
    getTodoItemByTodoId,
    renameTodoItemById,
    updateStatusTodoItemById,
    removeTodoItemById,
  };
};

export default TodoService;
