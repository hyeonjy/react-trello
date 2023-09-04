import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { useState } from "react";
import {
  filterWithIndex,
  handleDeleteCard,
  saveTodoListToLocalStorage,
} from "./utils/todo";
import ToDoForm from "./Components/ToDoForm";
import BoardForm from "./Components/BoardForm";
import ButtonBox from "./Components/ButtonBox";
import Trash from "./Components/Trash";

interface IWrapperProps {
  $isOpen: boolean;
  $newBoard: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  height: 100%;
  background-color: ${(props) =>
    props.$isOpen || props.$newBoard ? "rgba(0, 0, 0, 0.4)" : "transparent"};
  filter: ${(props) =>
    props.$isOpen || props.$newBoard ? "blur(2px)" : "none"};
`;

const HeaderBox = styled.div`
  width: 100%;
  padding: 40px 60px;
  display: flex;
  justify-content: center;
`;

const HeaderH1 = styled.h1`
  font-size: 45px;
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
  text-align: center;
  color: ${(props) => props.theme.headerColor};
  @media screen and (max-width: 750px) {
    width: 317px;
  }
`;

const Boards = styled.div`
  display: grid;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 40px 0;
  gap: 50px;
  margin: 0 auto;
  @media screen and (min-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 979px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [newBoard, setNewBoard] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [toDoId, setToDoId] = useState<null | number>(null);
  const [boardId, setBoardId] = useState<null | number>(null);
  const [trashOpen, setTrashOpen] = useState<boolean>(false);

  const onDragStart = ({ type }: { type: string }) => {
    if (type === "board") {
      setTrashOpen(true);
    }
  };

  const onDragEnd = (info: DropResult) => {
    setTrashOpen(false);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === "trash") {
      handleDeleteCard(setToDos, +source.droppableId, +draggableId);
    } else {
      if (destination?.droppableId === source.droppableId) {
        // same board movement
        setToDos((allBoard) => {
          const allBoardCopy = [...allBoard];
          const { boardFilter, boardIdx } = filterWithIndex(
            allBoardCopy,
            +source.droppableId
          );
          const cardCopy = [...boardFilter.toDos];
          const taskObj = boardFilter.toDos[source.index];

          cardCopy.splice(source.index, 1);
          cardCopy.splice(destination.index, 0, taskObj);
          boardFilter.toDos = cardCopy;
          allBoardCopy.splice(boardIdx, 1, boardFilter);
          saveTodoListToLocalStorage(allBoardCopy);
          return allBoardCopy;
        });
      } else {
        //cross board movement
        setToDos((allBoard) => {
          const allBoardCopy = [...allBoard];
          const { boardFilter: sourceBoard, boardIdx: sourceBoardIdx } =
            filterWithIndex(allBoardCopy, +source.droppableId);
          const {
            boardFilter: destinationBoard,
            boardIdx: destinationBoardIdx,
          } = filterWithIndex(allBoardCopy, +destination.droppableId);

          const sourceCard = [...sourceBoard.toDos];
          const destinationCard = [...destinationBoard.toDos];
          const taskObj = sourceBoard.toDos[source.index];

          sourceCard.splice(source.index, 1);
          destinationCard.splice(destination.index, 0, taskObj);
          sourceBoard.toDos = sourceCard;
          destinationBoard.toDos = destinationCard;
          allBoardCopy.splice(sourceBoardIdx, 1, sourceBoard);
          allBoardCopy.splice(destinationBoardIdx, 1, destinationBoard);
          saveTodoListToLocalStorage(allBoardCopy);
          return allBoardCopy;
        });
      }
    }
  };

  return (
    <>
      <DragDropContext onBeforeDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Wrapper $isOpen={isOpen} $newBoard={newBoard}>
          <HeaderBox>
            <HeaderH1>Daily Schedule</HeaderH1>
            <ButtonBox setNewBoard={setNewBoard} />
          </HeaderBox>

          <Boards>
            {Object.keys(toDos).map((index) => (
              <Board
                boardId={toDos[+index].id}
                boardTitle={toDos[+index].title}
                key={index}
                toDos={toDos[Number(index)].toDos}
                setIsOpen={setIsOpen}
                setToDoId={setToDoId}
                setBoardId={setBoardId}
              />
            ))}
          </Boards>
        </Wrapper>

        <Trash $trashOpen={trashOpen} />
      </DragDropContext>

      {/* 투두 리스트 form*/}
      {isOpen && (
        <ToDoForm
          toDoId={toDoId}
          setToDoId={setToDoId}
          setIsOpen={setIsOpen}
          boardId={boardId}
          setBoardId={setBoardId}
        />
      )}

      {/* 보드 추가 폼 */}
      {newBoard && <BoardForm setNewBoard={setNewBoard} />}
    </>
  );
}

export default Home;
