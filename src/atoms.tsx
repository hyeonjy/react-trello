import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const localStorageTodo = localStorage.getItem("TODOLIST") || "{}";
const parsedLocalStorageTodo = JSON.parse(localStorageTodo);

// export const isDarkAtom = atom({
//   key: "isDark",
//   default: true,
// });

const { persistAtom } = recoilPersist({
  key: "isDarkLocal",
  storage: localStorage,
});

export const isDarkAtom = atom<boolean>({
  key: "isDark",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export interface ITodo {
  id: number;
  text: string;
  content: string;
  type: string;
}

export interface IBoard {
  id: number;
  title: string;
  toDos: ITodo[];
}

export interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default:
    localStorageTodo !== "{}"
      ? parsedLocalStorageTodo
      : {
          TO_DO: [],
          DOING: [],
          DONE: [],
        },
});
