import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { AddBox } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";

type AddItemType = {
  addItem: (title: string) => void;
  disabled?: boolean;
};

const AddItem = React.memo((props: AddItemType) => {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<string | null>(null);

  const addItem = () => {
    if (title.trim()) {
      props.addItem(title.trim());
      setTitle("");
    } else {
      setError("Title is required");
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div>
      <TextField
        value={title}
        variant={"outlined"}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        error={!!error}
        label={"Title"}
        helperText={error}
        disabled={props.disabled}
      />
      <IconButton color={"primary"} onClick={addItem} disabled={props.disabled}>
        <AddBox />
      </IconButton>
      {/*{error && <div className="error-message">{error}</div>}*/}
    </div>
  );
});

export default AddItem;
