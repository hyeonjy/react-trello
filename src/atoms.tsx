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
              {
                id: 1,
                text: "토익",
                content: "영단어 50개 암기",
                type: "study",
              },
              {
                id: 123,
                text: "코딩",
                content: "리액트 강의 듣기",
                type: "study",
              },
            ],
          },
          {
            id: 2,
            title: "DOING",
            toDos: [
              {
                id: 12,
                text: "운동",
                content: "조깅하기",
                type: "exercise",
              },
            ],
          },
          {
            id: 3,
            title: "DONE",
            toDos: [],
          },
        ],
});
