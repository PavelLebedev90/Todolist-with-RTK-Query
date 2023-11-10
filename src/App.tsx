import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography
} from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { useLogoutMutation, useMeQuery } from "api/rtk_query_auth_api";
import TodolistList from "./components/TodolistList";

function App() {
  const { authUserId, error, isLoading, isFetching } = useMeQuery(undefined, {
    selectFromResult: ({data, ...rest}) => ({authUserId: data?.id, ...rest})
  });
  const [logoutUser] = useLogoutMutation();

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const logout = async () => {
    await logoutUser().unwrap();
  };

  return (
    <div className="App">
      <AppBar position={"static"}>
        <Toolbar>
          <IconButton edge={"start"} color={"inherit"} area-label={"menu"}>
            <Menu />
          </IconButton>
          <Typography variant={"h6"}>News</Typography>
          {!!authUserId && (
            <Button color={"inherit"} onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isFetching && <LinearProgress color="primary" style={{ position: "relative" }} />}
      {error && <div>Error</div>}
      <Container fixed>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TodolistList isLoggedIn={!!authUserId} />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
