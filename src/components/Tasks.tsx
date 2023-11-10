import { Delete } from "@mui/icons-material";
import { Checkbox, CircularProgress, IconButton } from "@mui/material";
import { RequestStatusType, useDeleteTaskMutation, useUpdateTaskMutation } from "api/rtk_query_task_api";
import { TaskDomainType, TaskStatuses } from "api/TaskAPI";
import { ChangeEvent } from "react";
import EditItem from "./EditItem";

type PropsType = {
  task: TaskDomainType
  isFetching: boolean
};

const Tasks = ({ task,isFetching }: PropsType) => {
  const [deleteTask, {isLoading: isLoadingDeleteTask}] = useDeleteTaskMutation();
  const [updateTask, {isLoading: isLoadingUpdateTask}] = useUpdateTaskMutation();
  const isLoading = isLoadingDeleteTask || isLoadingUpdateTask || isFetching
  const onClickHandler = () => deleteTask({ taskId: task.id, todolistId: task.todoListId });
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      model: {
        ...task,
        status,
      },
    });
  };
  const editTask = (title: string) => {
    updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      model: {
        ...task,
        title,
      },
    });
  };
  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox color={"primary"} onChange={onChangeHandler} checked={task.status > 0} />
      <EditItem title={task.title} editStateItem={editTask} isLoading={isLoading} />
      <IconButton onClick={onClickHandler} disabled={isLoading}>
        {isLoading ? <CircularProgress disableShrink size={17} /> : <Delete />}
      </IconButton>
    </div>
  );
};

export default Tasks;
