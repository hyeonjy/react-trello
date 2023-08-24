import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const localStorageTodo = localStorage.getItem("TODOLIST") || "{}";
const parsedLocalStorageTodo = JSON.parse(localStorageTodo);

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

export const toDoState = atom<IBoard[]>({
  key: "toDo",
  default:
    localStorageTodo !== "{}"
      ? parsedLocalStorageTodo
      : [
          {
            id: 1,
            title: "TO_DO",
            toDos: [
              { id: 1, text: "메모1", content: "11111", type: "study" },
              { id: 123, text: "메모3", content: "33333", type: "study" },
            ],
          },
          {
            id: 2,
            title: "DOING",
            toDos: [
              { id: 12, text: "메모2", content: "222222", type: "study" },
            ],
          },
          {
            id: 3,
            title: "DONE",
            toDos: [],
          },
        ],
});
