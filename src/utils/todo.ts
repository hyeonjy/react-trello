import { IBoard, IToDoState } from "../atoms";

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
