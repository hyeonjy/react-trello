import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { isDarkAtom, toDoState } from "./atoms";
import Board from "./Components/Board";
import { useState } from "react";
import { saveTodoListToLocalStorage } from "./utils/todo";
import ToDoForm from "./Components/ToDoForm";
import BoardForm from "./Components/BoardForm";
import ButtonBox from "./Components/ButtonBox";

const HeaderBox = styled.div`
  width: 100%;
  padding: 40px 60px;
`;

const HeaderH1 = styled.h1`
  font-size: 45px;
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
  text-align: center;
  color: ${(props) => props.theme.headerColor};
`;

interface IWrapperProps {
  isOpen: boolean;
  newBoard: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  height: 100vh;
  background-color: ${(props) =>
    props.isOpen || props.newBoard ? "rgba(0, 0, 0, 0.4)" : "transparent"};
  filter: ${(props) => (props.isOpen || props.newBoard ? "blur(2px)" : "none")};
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
  const [darkAtom, setDarkAtom] = useRecoilState(isDarkAtom);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [toDoId, setToDoId] = useState<null | number>(null);
  const [boardId, setBoardId] = useState<null | number>(null);

  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement
      setToDos((allBoard) => {
        const allBoardCopy = [...allBoard];
        let boardIdx = 0;
        const boardFilter = {
          ...allBoardCopy.filter((board, index) => {
            if (board.id === +source.droppableId) {
              boardIdx = index;
            }
            return board.id === +source.droppableId;
          })[0],
        };
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
        let sourceBoardIdx = 0;
        let destinationBoardIdx = 0;
        const sourceBoard = {
          ...allBoardCopy.filter((board, index) => {
            if (board.id === +source.droppableId) {
              sourceBoardIdx = index;
            }
            return board.id === +source.droppableId;
          })[0],
        };
        const destinationBoard = {
          ...allBoardCopy.filter((board, index) => {
            if (board.id === +destination.droppableId) {
              destinationBoardIdx = index;
            }
            return board.id === +destination.droppableId;
          })[0],
        };
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
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper isOpen={isOpen} newBoard={newBoard}>
          <HeaderBox>
            <HeaderH1>Daily Schedule</HeaderH1>
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
          <ButtonBox setNewBoard={setNewBoard} />
        </Wrapper>
      </DragDropContext>
      {isOpen && (
        <ToDoForm
          toDoId={toDoId}
          setToDoId={setToDoId}
          setIsOpen={setIsOpen}
          boardId={boardId}
          setBoardId={setBoardId}
        />
      )}
      {newBoard && <BoardForm setNewBoard={setNewBoard} />}
    </>
  );
}

export default Home;
