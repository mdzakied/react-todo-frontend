import { Link } from "react-router-dom";

import { Button } from "primereact/button";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TodoService from "@services/TodoService";

import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";

import Notification from "@shared/components/Notification/Notification";

export default function Todo() {
  // use service and utils with useMemo -> prevent re-render
  const todoService = useMemo(() => TodoService(), []);
  const notification = useMemo(() => Notification(), []);

  // access the client
  const queryClient = useQueryClient();

  // get all todo -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return await todoService.getAllTodo();
    },
  });

  // update todo status -> react query
  const { mutate: updateStatusTodoItemById } = useMutation({
    mutationFn: async (payload) => {
      return await todoService.updateStatusTodoItemById(payload);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Status updated");

      // update cache todo
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <>
      <section id="todoPage">
        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Todo</span>
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

        {/* Todo List */}
        <div className="mt-6">
          {/* Data */}
          <div className="justify-content-center grid">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data.data.map((todo) => (
                <div key={todo.id} className="h-auto">
                  {/* Card */}
                  <Card title={todo.name} className="w-20rem h-auto m-4">
                    <ul className="px-3 my-2">
                      {todo.items?.map((item) => (
                        <li
                          key={item.id}
                          className="card border-round shadow-3 mb-4 p-3"
                        >
                          <div className="flex flex-row gap-2">
                            {/* Status */}
                            <div className="card flex align-items-center justify-content-center">
                              <Checkbox
                                checked={item.itemCompletionStatus}
                                onChange={() => {
                                  updateStatusTodoItemById({
                                    todo_id: todo.id,
                                    id: item.id,
                                  });
                                }}
                              ></Checkbox>
                            </div>

                            {/* Name */}
                            <div>
                              <p>{item.name}</p>
                            </div>

                            {/* Action Button */}
                            <div className="ml-auto flex align-items-center gap-2">
                              {/* Action Edit */}
                              <Button
                                icon="pi pi-pencil"
                                severity="secondary"
                                size="small"
                                className="w-2rem h-2rem"
                              ></Button>

                              {/* Action Delete */}
                              <Button
                                icon="pi pi-trash"
                                severity="danger"
                                size="small"
                                className="w-2rem h-2rem"
                              ></Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="flex">
                      <Button
                        label={"Add"}
                        className="bgn-success mt-2 shadow-3 ml-auto"
                        severity="success"
                        size="small"
                        icon="pi pi-plus-circle"
                      />
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
