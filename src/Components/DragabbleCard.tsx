import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { useState, useCallback, SetStateAction, Dispatch } from "react";
import { useRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";
import { saveTodoListToLocalStorage } from "../utils/todo";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import SubCard from "./SubCard";

const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.05)" : "none"};
`;

const CardList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  color: black;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
`;

const CardIcon = styled.div`
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

const ChevronIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  cursor: pointer;
  margin-right: 5px;
  color: #222222;
`;

interface IDragabbleCardProps {
  toDo: ITodo;
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
  setBoardId: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
}

function DragabbleCard({
  toDo,
  toDoId,
  toDoText,
  index,
  boardId,
  setBoardId,
  setIsOpen,
  setToDoId,
}: IDragabbleCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);

  const handleDeleteCard = useCallback(() => {
    setToDos((allBoard) => {
      const boardCopy = [...allBoard[boardId]];
      const filterTodos = boardCopy.filter((todo) => todo.id !== toDoId);
      const result = { ...allBoard, [boardId]: filterTodos };
      saveTodoListToLocalStorage(result);
      return result;
    });
  }, [boardId, setToDos]);

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <>
          <Card
            isDragging={snapshot.isDragging}
            ref={magic.innerRef}
            {...magic.dragHandleProps}
            {...magic.draggableProps}
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
          >
            <CardList>
              <span onClick={() => setIsCard((prev) => !prev)}>
                <ChevronIcon icon={isCard ? faChevronUp : faChevronDown} />
                {toDo.text}
              </span>
              <IconBox>
                {isHovering && (
                  <>
                    <CardIcon
                      className="material-symbols-outlined"
                      onClick={() => {
                        setIsOpen(true);
                        setToDoId(toDoId);
                        setBoardId(boardId);
                      }}
                    >
                      edit
                    </CardIcon>
                    <CardIcon
                      className="material-icons"
                      onClick={handleDeleteCard}
                    >
                      delete
                    </CardIcon>
                  </>
                )}
              </IconBox>
            </CardList>
            <SubCard isCard={isCard} toDo={toDo} />
          </Card>
        </>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
