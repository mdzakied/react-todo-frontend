import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import TodoService from "@services/TodoService";
import Notification from "@shared/components/Notification/Notification";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { confirmDialog } from "primereact/confirmdialog";

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

  // delete todo -> react query
  const { mutate: removeTodoById } = useMutation({
    mutationFn: async (id) => {
      return await todoService.removeTodoById(id);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Todo deleted");

      // update cache todo
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // update todo item status -> react query
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

  // delete todo item -> react query
  const { mutate: removeTodoItemById } = useMutation({
    mutationFn: async (id) => {
      return await todoService.removeTodoItemById(id);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Todo item deleted");

      // update cache todo
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // delete action  todo
  const acceptDelete = (payload) => {
    removeTodoById(payload);
  };

  const confirmDelete = (payload) => {
    console.log(payload);
    
    confirmDialog({
      message: "Are you sure you want to delete ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => acceptDelete(payload),
    });
  };

  // delete action item todo
  const acceptDeleteItem = (payload) => {
    removeTodoItemById(payload);
  };

  const confirmDeleteItem = (payload) => {
    confirmDialog({
      message: "Are you sure you want to delete ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => acceptDeleteItem(payload),
    });
  };

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
          <div className="mx-auto masonry-grid">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data.data.map((todo) => (
                <div key={todo.id} className="h-auto">
                  {/* Card */}
                  <Card title={todo.name} className="w-20rem inline-block h-auto m-4">
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
                                onClick={() => {
                                  confirmDeleteItem({
                                    todo_id: todo.id,
                                    id: item.id,
                                  });
                                }}
                              ></Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Button Action */}
                    <div className="flex gap-2">
                      <Button
                        label={"Delete"}
                        className="bgn-danger mt-2 shadow-3 ml-auto"
                        severity="danger"
                        size="small"
                        icon="pi pi-trash"
                        onClick={() => {
                          confirmDelete(todo.id);
                        }}
                      />
                      <Button
                        label={"Add"}
                        className="bgn-success mt-2 shadow-3"
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
