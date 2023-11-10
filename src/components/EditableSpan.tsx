import React, { ChangeEvent, KeyboardEvent, useState } from "react";
type EditableSpanType = {
  title: string;
  //changeTitle: (newTitle: string)=> void
  changeTaskTitleHandler: (title: string) => void;
};
const EditableSpan = (props: EditableSpanType) => {
  let [title, setTitle] = useState(props.title);
  const [editMode, setEditMode] = useState<boolean>(false);
  const onEditMode = () => {
    setEditMode(true);
    setTitle(props.title);
  };
  const offEditMode = () => {
    setEditMode(false);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      offEditMode();
      props.changeTaskTitleHandler(title);
    }
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  return editMode ? (
    <input value={title} autoFocus onBlur={offEditMode} onChange={changeTitle} onKeyPress={onKeyPress} />
  ) : (
    <span onDoubleClick={onEditMode}>{props.title}</span>
  );
};

export default EditableSpan;
