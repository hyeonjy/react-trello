import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState, SetStateAction, Dispatch, useCallback } from "react";
import { saveTodoListToLocalStorage } from "../utils/todo";

const Wrapper = styled.div`
  width: 275px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 3px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
`;

const TitleIcon = styled(FontAwesomeIcon).withConfig({
  shouldForwardProp: (prop) => "message" !== prop,
})`
  font-size: 15px;
  margin-left: 1px;
  border-radius: 5px;
  padding: 2px;
  cursor: pointer;
`;

interface IAreaProps {
  $isDraggingFromThis: boolean;
  $isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#FFF0E0"
      : props.$isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const AddBtn = styled.div`
  background-color: ${(props) => props.theme.AddBgColor};
  color: ${(props) => props.theme.AddtextColor};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 100%;
  font-weight: 600;
  padding: 10px;
  cursor: pointer;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardTitle: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
  boardId: number | null;
  setBoardId: Dispatch<SetStateAction<number | null>>;
}

function Board({
  toDos,
  boardTitle,
  setIsOpen,
  setToDoId,
  boardId,
  setBoardId,
}: IBoardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const setToDos = useSetRecoilState(toDoState);

  const handleDeleteBoard = useCallback(() => {
    setToDos((allBoard) => {
      const allBoardCopy = [...allBoard];
      const boardFilter = allBoardCopy.filter((board, index) => {
        return board.id !== boardId;
      });
      saveTodoListToLocalStorage(boardFilter);
      return boardFilter;
    });
  }, [boardId, setToDos]);

  return (
    <Droppable droppableId={boardId + ""} type="board">
      {(magic, info) => (
        <Wrapper
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}
        >
          <TitleBox>
            <Title>{boardTitle}</Title>
            <IconBox onClick={handleDeleteBoard}>
              {isHovering && <TitleIcon icon={faX} />}
            </IconBox>
          </TitleBox>
          <Area
            ref={magic.innerRef}
            {...magic.droppableProps}
            $isDraggingOver={info.isDraggingOver}
            $isDraggingFromThis={Boolean(info.draggingFromThisWith)}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                boardId={boardId}
                toDo={toDo}
                setIsOpen={setIsOpen}
                setToDoId={setToDoId}
                setBoardId={setBoardId}
                index={index}
              />
            ))}
            {magic.placeholder}
          </Area>
          <AddBtn
            onClick={() => {
              setIsOpen(true);
              setBoardId(boardId);
            }}
          >
            <span>+ 추가</span>
          </AddBtn>
        </Wrapper>
      )}
    </Droppable>
  );
}
export default Board;
