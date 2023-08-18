import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { isDarkAtom, toDoState } from "./atoms";
import Board from "./Components/Board";
import { useEffect, useRef, useState } from "react";
import { saveTodoListToLocalStorage } from "./utils/todo";
import ToDoForm from "./Components/ToDoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMoon as faSolidMoon,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon as faRegularMoon } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import BoardForm from "./Components/BoardForm";

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
  /* margin-top: 220px; */
  /* width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center; */
  /* height: 100vh; */
  position: relative;
  height: 100vh;
  background-color: ${(props) =>
    props.isOpen || props.newBoard ? "rgba(0, 0, 0, 0.4)" : "transparent"};
  filter: ${(props) => (props.isOpen || props.newBoard ? "blur(2px)" : "none")};
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* display: flex;
  justify-content: center;
  align-items: flex-start; */
  /* background-color: black; */
  padding: 40px 60px;
  width: 100%;
  gap: 50px;
  /* height: calc(100vh - 10rem); */
`;

const ButtonBox = styled.div`
  justify-content: space-between;
  width: 140px;
  display: flex;
  position: absolute;
  top: 30px;
  right: 30px;
`;

const Button = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.boardColor};
  color: ${(props) => props.theme.headerColor};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const ButtonIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
`;

function Home() {
  const [boardId, setBoardId] = useState("TO_DO");
  const [isOpen, setIsOpen] = useState(false);
  const [newBoard, setNewBoard] = useState(false);
  const [darkAtom, setDarkAtom] = useRecoilState(isDarkAtom);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [toDoId, setToDoId] = useState<null | number>(null);

  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement
      setToDos((allBoard) => {
        const boardCopy = [...allBoard[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const result = {
          ...allBoard,
          [source.droppableId]: boardCopy,
        };
        saveTodoListToLocalStorage(result);
        return result;
      });
    } else {
      //cross board movement
      setToDos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        const result = {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
        saveTodoListToLocalStorage(result);
        return result;
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
            {Object.keys(toDos).map((boardId) => (
              <Board
                boardId={boardId}
                key={boardId}
                toDos={toDos[boardId]}
                setIsOpen={setIsOpen}
                setBoardId={setBoardId}
                setToDoId={setToDoId}
              />
            ))}
          </Boards>
          <ButtonBox>
            <Button onClick={() => setDarkAtom((prev) => !prev)}>
              <ButtonIcon icon={darkAtom ? faRegularMoon : faSolidMoon} />
            </Button>
            <Button onClick={() => setNewBoard((prev) => !prev)}>
              <ButtonIcon icon={faPlus} />
            </Button>
          </ButtonBox>
        </Wrapper>
      </DragDropContext>
      {isOpen && (
        <ToDoForm
          toDoId={toDoId}
          setToDoId={setToDoId}
          boardId={boardId}
          setIsOpen={setIsOpen}
        />
      )}
      {newBoard && <BoardForm setNewBoard={setNewBoard} />}
    </>
  );
}

export default Home;
