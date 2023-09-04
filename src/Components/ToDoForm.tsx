import { faA, faTag, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { filterWithIndex, saveTodoListToLocalStorage } from "../utils/todo";
import { SetStateAction, Dispatch, useEffect, useRef, useState } from "react";

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
  position: fixed;
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
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
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
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
`;

export const TitleInput = styled.input`
  font-size: 15px;
  border: 0;
  padding: 5px;
  border-bottom: 3px solid #5b00d1;
  width: 150px;
  font-weight: 600;
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
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
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
  font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
  & > option {
    font-family: "ONE-Mobile-POP", "Source Sans Pro", sans-serif;
  }
`;

const TextArea = styled.textarea`
  width: 80%;
  background-color: #f5f5f5;
  margin-top: 30px;
  height: 150px;
  border-color: white;
  border-radius: 5px;
  resize: none;
  font-weight: 600;
  font-size: 15px;
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
  toDoId: number | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setToDoId: Dispatch<SetStateAction<number | null>>;
  boardId: number | null;
  setBoardId: Dispatch<SetStateAction<number | null>>;
}

const types = ["study", "work", "exercise", "reading"];

function ToDoForm({
  toDoId,
  setToDoId,
  setIsOpen,
  boardId,
  setBoardId,
}: IToDoFromProps) {
  const MAX_LENGTH = 6;
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [scrollPosition, setScrollPosition] = useState(window.scrollY);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const ref = useRef<HTMLDivElement | undefined>();

  //모달 open시 스크롤 방지
  useEffect(() => {
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("modal-open"); // body에 클래스 추가
    return () => {
      document.body.style.top = "";
      document.body.classList.remove("modal-open"); // body에서 클래스 제거
      window.scrollTo(0, scrollPosition);
    };
  }, []);

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
    //스케줄 수정의 경우
    if (toDoId !== null) {
      const allBoardCopy = [...toDos];
      const { boardFilter, boardIdx } = filterWithIndex(allBoardCopy, boardId);
      const cardCopy = [...boardFilter.toDos];
      const filterTodos = cardCopy.filter((todo) => todo.id === toDoId);
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
    const allBoardCopy = [...toDos];
    const { boardFilter, boardIdx } = filterWithIndex(allBoardCopy, boardId);
    const cardCopy = [...boardFilter.toDos];
    //스케줄 수정
    if (toDoId !== null) {
      let index = 0;
      filterTodos = cardCopy.filter((todo, idx) => {
        if (todo.id === toDoId) {
          index = idx;
        }
        return todo.id !== toDoId;
      });
      filterTodos.splice(index, 0, newToDo);
    }
    //스케줄 작성
    else {
      filterTodos = [...cardCopy, newToDo];
    }
    boardFilter.toDos = filterTodos;
    allBoardCopy.splice(boardIdx, 1, boardFilter);
    setToDos(allBoardCopy);
    saveTodoListToLocalStorage(allBoardCopy);
    setValue("toDo", "");
    setValue("content", "");
    setIsOpen(false);
    setToDoId(null);
    setBoardId(null);
  };

  //한글의 경우 maxLength 사용시 버그 해결
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_LENGTH) {
      setValue("toDo", e.target.value.slice(0, MAX_LENGTH));
    }
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
            type="text"
            maxLength={6}
            {...register("toDo", {
              required: true,
              onChange: (e) => {
                onChange(e);
              },
            })}
          />
        </TitleBox>
        <SelectBox>
          <h1>
            <TagIcon icon={faTag} />
            분야
          </h1>
          <CategorySelect {...register("type", { required: true })}>
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </CategorySelect>
        </SelectBox>
        <TextArea
          maxLength={115}
          {...register("content", {
            required: true,
          })}
          placeholder={`세부 사항을 작성해주세요`}
        />
        <SubmitBtn type="submit" value={toDoId === null ? "등록" : "수정"} />
      </Form>
    </Modal>
  );
}

export default ToDoForm;
