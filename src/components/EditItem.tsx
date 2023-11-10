import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { TextField } from "@mui/material";
import { RequestStatusType } from "api/rtk_query_task_api";

type EditItemType = {
  title: string;
  editStateItem: (title: string) => void;
  isLoading?: boolean;
};

const EditItem = React.memo(({ editStateItem, title: taskTitle, isLoading }: EditItemType) => {
  const [edit, setEdit] = useState(true);
  const [title, setTitle] = useState(taskTitle);
  let [error, setError] = useState("");
  const onDoubleClick = () => {
    if (isLoading) {
      return;
    }
    setEdit(!edit);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    setError("");
  };
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim()) {
      editStateItem(title.trim());
      setEdit(!edit);
    } else {
      setError("value not valid");
    }
  };

  return edit || isLoading ? (
    <span onDoubleClick={onDoubleClick}>{isLoading ? "loading..." : taskTitle}</span>
  ) : (
    <TextField
      className="editItem"
      variant={"outlined"}
      value={title}
      onChange={onChangeHandler}
      onKeyPress={onKeyPress}
      placeholder={error}
      autoFocus
    />
  );
});

export default EditItem;
