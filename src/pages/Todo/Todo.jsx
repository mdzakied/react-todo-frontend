import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import TodoService from "@services/TodoService";
import Notification from "@shared/components/Notification/Notification";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// create schema for validator with zod
const schema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characters" }),
});

export default function Todo() {
  // use state for data
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState("");
  const [currentTodo, setCurrentTodo] = useState({});

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

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

  // service todo (add todo, add todo item and edit todo item) -> useMutation react query
  // register bank
  const { mutate: serviceFormTodo, isPending } = useMutation({
    mutationFn: async (payload) => {
      // check form
      if (form === "Add Todo") {
        // add todo
        return await todoService.addTodo(payload);
      } else if (form === "Add Todo Item") {
        // add todo item
        console.log(payload);

        return await todoService.addTodoItemById(payload, currentTodo.id);
      }
    },

    onSuccess: () => {
      // notification
      if (form === "Add Todo") {
        notification.showSuccess("Todo saved");
      } else if (form === "Add Todo Item") {
        notification.showSuccess("Todo item saved");
      }

      // close dialog
      setVisible(false);

      // update cache bank
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // delete todo -> useMutation react query
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

  // update todo item status -> useMutation react query
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

  // delete todo item -> useMutation react query
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

  // submit form
  const onSubmitForm = (data) => {
    // serviceFormTodo -> useMutation react query
    serviceFormTodo(data);

    // reset form
    reset();
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
              <Button
                label={"Add"}
                className="bgn-success shadow-3"
                severity="success"
                size="small"
                icon="pi pi-plus-circle"
                onClick={() => {
                  setForm("Add Todo");
                  setVisible(true);
                }}
              />
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
                  <Card
                    title={todo.name}
                    className="w-20rem inline-block h-auto m-4"
                  >
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
                                onClick={() => {
                                  setForm("Edit Todo Item");
                                  setVisible(true);
                                }}
                                disabled
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
                        onClick={() => {
                          setForm("Add Todo Item");
                          setCurrentTodo(todo);
                          setVisible(true);
                        }}
                        disabled
                      />
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Dialog form */}
      <Dialog
        id="dialogForm"
        header={form}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="mt-5">
            {/* Name */}
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-tags"></i>
              </span>
              <InputText
                {...register("name")}
                id="name"
                placeholder="Name"
                variant="filled"
                className="p-inputtext-sm w-full lg:w-10"
                aria-describedby="name-help"
              />
            </div>

            {/* Error name */}
            {errors.name && (
              <small id="name-help" className="text-xs p-error">
                {errors.name.message}
              </small>
            )}

            {/* Item Name */}
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-tags"></i>
              </span>
              <InputText
                {...register("itemName")}
                id="name"
                placeholder={
                  form === "Edit Todo Item" ? currentTodo.name : "Name"
                }
                variant="filled"
                className="p-inputtext-sm w-full lg:w-10"
                aria-describedby="name-help"
              />
            </div>

            {/* Error item name */}
            {errors.itemName && (
              <small id="itemName-help" className="text-xs p-error">
                {errors.itemName.message}
              </small>
            )}

            {/* Submit Button */}
            <div>
              <Button
                label={isPending ? "Loading..." : "Submit"}
                className="bgn-success w-full mt-4 py-2"
                severity="success"
                size="small"
                disabled={!isValid || isPending}
              />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}
