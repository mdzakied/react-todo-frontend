import { Link } from "react-router-dom";

import { Button } from "primereact/button";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TodoService from "@services/TodoService";

import { Checkbox } from "primereact/checkbox";

export default function Todo() {
  // use service and utils with useMemo -> prevent re-render
  const todoService = useMemo(() => TodoService(), []);

  // get all todo -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return await todoService.getAllTodo();
    },
  });

  return (
    <>
      <section id="bankPage">
        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Bank</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of registered Todo
              </span>
            </div>
          </div>

          {/* Add Button */}
          <div>
            <div className="pl-4">
              <Link to="/dashboard/bank/add">
                <Button
                  label={"Add"}
                  className="bgn-success shadow-3"
                  severity="success"
                  size="small"
                  icon="pi pi-plus-circle"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-row mt-6">
          {/* <TodoList /> */}
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data.data.map((todo) => (
                <div key={todo.id}>
                  <p>{todo.name}</p>
                  <ul className="list-group">
                    {todo.items?.map((item) => (
                      <li key={item.id} className="list-group-item">
                        {item.name}
                        {/* Status */}

                        <div className="card flex justify-content-center">
                          <Checkbox
                            checked={item.itemCompletionStatus}
                          ></Checkbox>
                        </div>
                        {/* Action Edit */}
                        <button
                          className="btn btn-primary"
                          onClick={() => todoService.editTodoItem(item.id)}
                        >
                          Edit
                        </button>

                        {/* Action Delete */}
                        <button
                          className="btn btn-danger"
                          onClick={() => todoService.deleteTodoItem(item.id)}
                        >
                          Delete
                        </button>

                        {/* Complete */}
                        <button
                          className="btn btn-success"
                          onClick={() => todoService.completeTodoItem(item.id)}
                        >
                          Complete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
