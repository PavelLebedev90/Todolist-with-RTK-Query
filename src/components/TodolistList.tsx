import { CircularProgress, Grid, Paper } from "@mui/material";
import { useCreateTodolistMutation, useGetTodolistsQuery } from "api/rtk_query_todo_api";
import { useCallback } from "react";
import { Navigate } from "react-router-dom";
import AddItem from "./AddItem";
import { Todolist } from "./Todolist";
interface ITodolistList {
  isLoggedIn: boolean;
}
const TodolistList = ({ isLoggedIn }: ITodolistList) => {
  const { data, isError } = useGetTodolistsQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [createTodolist, {isLoading}] = useCreateTodolistMutation();
  const addTodolist = useCallback((title: string) => {
    createTodolist(title);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      {isError && <h3>Произошла ошибка получения тудулистов</h3>}
      <Grid container style={{ padding: "20px" }}>
        <AddItem addItem={addTodolist} />
        {isLoading && <CircularProgress disableShrink size={17} /> }
      </Grid>
      <Grid container spacing={3}>
        {data &&
          data.map((todolist) => {
            return (
              <Grid item key={todolist.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist todolist={todolist} />
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default TodolistList;
