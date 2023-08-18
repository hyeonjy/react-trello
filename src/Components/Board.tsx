import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { IBoard, ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, SetStateAction, Dispatch } from "react";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  /* max-height: calc(100vh - 30rem); */
  /* max-height: calc(100vh - 11rem); */
  display: flex;
  flex-direction: column;
  min-height: 200px;
  /* overflow: hidden; */
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

const TitleIcon = styled.div`
  font-size: 20px;
  margin-left: 1px;
  border-radius: 5px;
  padding: 2px;
  cursor: pointer;
  color: #222222;
  &:hover {
    background-color: rgb(235 232 230);
  }
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
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
  boardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setBoardId: Dispatch<SetStateAction<string>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
}

function Board({
  toDos,
  boardId,
  setIsOpen,
  setBoardId,
  setToDoId,
}: IBoardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const setToDos = useSetRecoilState(toDoState);

  return (
    <Wrapper
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <TitleBox>
        <Title>{boardId}</Title>
        <IconBox>
          {isHovering && (
            <>
              {/* <TitleIcon className="material-symbols-outlined">edit</TitleIcon> */}
              <TitleIcon className="material-icons">delete</TitleIcon>
            </>
          )}
        </IconBox>
      </TitleBox>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDo={toDo}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
                setBoardId={setBoardId}
                setIsOpen={setIsOpen}
                setToDoId={setToDoId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
      <AddBtn
        onClick={() => {
          setIsOpen(true);
          setBoardId(boardId);
        }}
      >
        <span>+ 추가</span>
      </AddBtn>
    </Wrapper>
  );
}
export default Board;
