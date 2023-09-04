import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import React, { useState, SetStateAction, Dispatch } from "react";
import { useSetRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";
import { handleDeleteCard } from "../utils/todo";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DetailCard from "./DetailCard";

const Card = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.$isDragging ? "#FFC107" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "0px 2px 5px rgba(0,0,0,0.05)" : "none"};
`;

const CardList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  height: 20px;
  & > span {
    min-width: 70%;
    padding: 10px 0;
  }
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
  boardId: number | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
  setBoardId: Dispatch<SetStateAction<number | null>>;
  index: number;
}

function DragabbleCard({
  toDo,
  boardId,
  setIsOpen,
  setToDoId,
  setBoardId,
  index,
}: IDragabbleCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const setToDos = useSetRecoilState(toDoState);

  return (
    <Draggable draggableId={toDo.id + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
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
                      setToDoId(toDo.id);
                      setBoardId(boardId);
                    }}
                  >
                    edit
                  </CardIcon>
                  <CardIcon
                    className="material-icons"
                    onClick={() => handleDeleteCard(setToDos, boardId, toDo.id)}
                  >
                    delete
                  </CardIcon>
                </>
              )}
            </IconBox>
          </CardList>
          <DetailCard isCard={isCard} toDo={toDo} />
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
