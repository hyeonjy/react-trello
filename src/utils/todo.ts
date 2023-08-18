import { IToDoState } from "../atoms";

export const saveTodoListToLocalStorage = (IToDoState: IToDoState) => {
  localStorage.setItem("TODOLIST", JSON.stringify(IToDoState));
};
