import { faA, faTag, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { saveTodoListToLocalStorage } from "../utils/todo";
import { SetStateAction, Dispatch, useEffect, useRef } from "react";

interface IModal {
  ref: React.MutableRefObject<HTMLDivElement | undefined>;
}

export const Modal = styled.div<IModal>`
  width: 400px;
  height: 390px;
  z-index: 999;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 8px;
  border-color: none;

  /* 가운데 배치 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const HeaderBox = styled.div`
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  background-color: #e8e8e8;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

export const Header = styled.h2`
  color: black;
  font-size: 16px;
  font-weight: 500;
`;

export const HeaderIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
  cursor: pointer;
  color: black;
`;

export const Form = styled.form`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  font-size: 20px;
  color: #5b00d1;
  font-weight: 500;
  justify-content: space-between;
`;

export const TitleInput = styled.input`
  font-size: 15px;
  border: 0;
  padding: 5px;
  border-bottom: 3px solid #5b00d1;
  &:focus {
    outline: none;
  }
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-top: 30px;
  font-size: 20px;
  color: #5b00d1;
  font-weight: 500;
`;

const TagIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;

const CategorySelect = styled.select`
  border: 0;
  border-bottom: 3px solid #5b00d1;
  outline: 0;
  padding-right: 5px;
  cursor: pointer;
  font-size: 18px;
`;

const TextArea = styled.textarea`
  width: 80%;
  background-color: #f5f5f5;
  margin-top: 30px;
  height: 150px;
  border-color: white;
  border-radius: 5px;
  resize: none;
  &:focus {
    outline: none;
  }
`;

export const SubmitBtn = styled.input`
  margin-top: 10px;
  background-color: #5b00d1;
  border-radius: 5px;
  padding: 8px;
  width: 80%;
  text-align: center;
  color: white;
  cursor: pointer;
`;

interface IForm {
  toDo: string;
  type: string;
  content: string;
}

interface IToDoFromProps {
  // ref: React.MutableRefObject<HTMLDivElement | undefined>;
  toDoId: number | null;
  boardId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
}

const types = ["study", "work", "exercise", "reading"];

function ToDoForm({ toDoId, setToDoId, boardId, setIsOpen }: IToDoFromProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const ref = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [ref]);

  useEffect(() => {
    if (toDoId !== null) {
      const boardCopy = toDos[boardId];
      const filterTodos = boardCopy.filter((todo) => todo.id === toDoId);
      setValue("toDo", filterTodos[0].text);
      setValue("content", filterTodos[0].content);
      setValue("type", filterTodos[0].type);
    }
  }, [toDoId]);

  const onValid = ({ toDo, content, type }: IForm) => {
    const newToDo = {
      id: toDoId !== null ? toDoId : Date.now(),
      text: toDo,
      content: content,
      type: type,
    };
    let filterTodos: any;
    if (toDoId !== null) {
      let index = 0;
      filterTodos = toDos[boardId].filter((todo, idx) => {
        if (todo.id === toDoId) {
          index = idx;
        }
        return todo.id !== toDoId;
      });
      filterTodos.splice(index, 0, newToDo);
    } else {
      filterTodos = [...toDos[boardId], newToDo];
    }
    setToDos((allBoards) => {
      const result = {
        ...allBoards,
        [boardId]: filterTodos,
      };
      saveTodoListToLocalStorage(result);
      return result;
    });
    setValue("toDo", "");
    setValue("content", "");
    setIsOpen(false);
    setToDoId(null);
  };

  return (
    <Modal ref={ref}>
      <HeaderBox>
        <Header>{toDoId === null ? "스케줄 작성" : "스케줄 수정"}</Header>
        <HeaderIcon
          icon={faX}
          onClick={() => {
            setIsOpen(false);
            setToDoId(null);
          }}
        />
      </HeaderBox>

      <Form onSubmit={handleSubmit(onValid)}>
        <TitleBox>
          <label htmlFor="title">
            <TagIcon icon={faA} />
            작업이름
          </label>
          <TitleInput
            id="title"
            {...register("toDo", { required: true })}
            type="text"
            placeholder={`작업이름을 작성해주세요`}
          />
        </TitleBox>
        <SelectBox>
          <h1>
            <TagIcon icon={faTag} />
            분야
          </h1>
          <CategorySelect {...register("type", { required: true })}>
            {types.map((type) => (
              <option value={type}>{type}</option>
            ))}
          </CategorySelect>
        </SelectBox>
        <TextArea
          {...register("content", { required: true })}
          placeholder={`세부 사항을 작성해주세요`}
        />
        <SubmitBtn type="submit" value={toDoId === null ? "등록" : "수정"} />
      </Form>
    </Modal>
  );
}

export default ToDoForm;
