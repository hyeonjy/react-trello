import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
  MutableRefObject,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  Header,
  HeaderBox,
  HeaderIcon,
  TitleInput,
  Form,
} from "./ToDoForm";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { saveTodoListToLocalStorage } from "../utils/todo";

//new board
const Wrapper = styled(Modal)`
  height: 200px;
`;

const Input = styled(TitleInput)`
  width: 80%;
  font-size: 20px;
  margin-top: 15px;
`;

const SubmitBtn = styled.input`
  margin-top: 40px;
  background-color: #5b00d1;
  border-radius: 5px;
  padding: 8px;
  width: 80%;
  text-align: center;
  color: white;
  cursor: pointer;
`;

interface IForm {
  board: string;
}

interface IBoardFormProps {
  setNewBoard: Dispatch<SetStateAction<boolean>>;
}

function BoardForm({ setNewBoard }: IBoardFormProps) {
  const ref = useRef<HTMLDivElement | undefined>();
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onValid = ({ board }: IForm) => {
    const newBoard = {
      id: Date.now(),
      title: board,
      toDos: [],
    };
    const allBoardCopy = [...toDos];
    allBoardCopy.splice(allBoardCopy.length, 0, newBoard);
    setToDos(allBoardCopy);
    saveTodoListToLocalStorage(allBoardCopy);

    setValue("board", "");
    setNewBoard(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setNewBoard(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [ref]);

  return (
    <Wrapper ref={ref}>
      <HeaderBox>
        <Header>보드 추가</Header>
        <HeaderIcon icon={faX} onClick={() => setNewBoard(false)} />
      </HeaderBox>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("board", { required: true })}
          type="text"
          placeholder={`보드 이름을 작성해주세요`}
        />

        <SubmitBtn type="submit" value="등록" />
      </Form>
    </Wrapper>
  );
}

export default BoardForm;
