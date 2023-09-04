import { SetterOrUpdater } from "recoil";
import { IBoard } from "../atoms";

export const saveTodoListToLocalStorage = (IBoard: IBoard[]) => {
  localStorage.setItem("TODOLIST", JSON.stringify(IBoard));
};

export const filterWithIndex = (
  allBoardCopy: IBoard[],
  boardId: number | null
) => {
  let boardIdx = 0;
  const boardFilter = {
    ...allBoardCopy.filter((board, index) => {
      if (board.id === boardId) {
        boardIdx = index;
      }
      return board.id === boardId;
    })[0],
  };
  return { boardFilter, boardIdx };
};

export const handleDeleteCard = (
  setToDos: SetterOrUpdater<IBoard[]>,
  boardId: null | number,
  toDoId: number
) => {
  setToDos((allBoard) => {
    const allBoardCopy = [...allBoard];
    const { boardFilter, boardIdx } = filterWithIndex(allBoardCopy, boardId);
    const cardCopy = [...boardFilter.toDos];
    const filterTodos = cardCopy.filter((todo) => todo.id !== toDoId);

    boardFilter.toDos = filterTodos;
    allBoardCopy.splice(boardIdx, 1, boardFilter);
    saveTodoListToLocalStorage(allBoardCopy);
    return allBoardCopy;
  });
};
