import { Delete } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { TaskStatuses, useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery } from "api/rtk_query_task_api";
import { TodolistAPIType, useDeleteTodolistMutation, useUpdateTodolistMutation } from "api/rtk_query_todo_api";
import AddItem from "components/AddItem";
import EditItem from "components/EditItem";
import Tasks from "components/Tasks";
import React, { useState } from "react";

type PropsType = {
  todolist: TodolistAPIType;
};
type TStatus = "all" | "active" | "completed";
export const Todolist = React.memo(({ todolist }: PropsType) => {
  const { id } = todolist;
  const [createTask, { isLoading: isLoadingCreateTask }] = useCreateTaskMutation();
  const { data: tasks, isLoading: isLoadingTasks, isFetching } = useGetTasksQuery(id);
  const [updateTodolist, { isLoading: isLoadingUpdateTodo }] = useUpdateTodolistMutation();
  const [deleteTodolist, { isLoading: isLoadingDeleteTodo }] = useDeleteTodolistMutation();
  const [, { isLoading: isLoadingDeleteTask }] = useDeleteTaskMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });

  const isLoading = isLoadingDeleteTodo || isLoadingUpdateTodo || isLoadingDeleteTask;
  const [status, setStatus] = useState<TStatus>("all");
  const onClickHandler = (value: TStatus) => setStatus(value);
  const addItem = (title: string) => {
    createTask({ todolistId: id, title });
  };
  const editTL = (title: string) => {
    updateTodolist({
      title,
      todolistId: id,
    });
  };
  if (isLoadingTasks) {
    return <div>Идет загрузка...</div>;
  }
  let tasksForTodolist = tasks?.items ?? [];

  if (status === "active") {
    tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.New);
  }
  if (status === "completed") {
    tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.Completed);
  }

  const deleteTodo = () => {
    deleteTodolist(id);
  };

  return (
    <div>
      <h3>
        <EditItem title={todolist.title} editStateItem={editTL} isLoading={isLoading} />
        <IconButton onClick={deleteTodo} disabled={isLoadingDeleteTodo}>
          {isLoading ? <CircularProgress disableShrink size={17} /> : <Delete />}
        </IconButton>
      </h3>
      <AddItem addItem={addItem} disabled={isLoadingDeleteTodo} />
      {isLoadingCreateTask && <CircularProgress disableShrink size={17} />}

      <div>
        {tasksForTodolist.map((t) => (
          <Tasks key={t.id} task={t} isFetching={isFetching}/>
        ))}
      </div>

      <div>
        <Button
          variant={status === "all" ? "outlined" : "text"}
          onClick={() => onClickHandler("all")}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={status === "active" ? "outlined" : "text"}
          onClick={() => onClickHandler("active")}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={status === "completed" ? "outlined" : "text"}
          onClick={() => onClickHandler("completed")}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
