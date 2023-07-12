import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  //register 함수는 onChange 이벤트, value, useState를 모두 대체함
  //watch는 form의 입력값들의 변화를 관찰할 수 있게 해주는 함수
  //handleSubmit은 event.preventDefault와 validation를 담당
  //setError는 특정한 에러를 발생시킴(예를 들어 비밀번호, 비밀번호 확인이 불일치할 때)
  //setError안에 shouldFocus는 마우스 커서
  // onValid는 react-hook-form이 모든 validation을 다 마쳤을때만(데이터가 모두 유효한 경우에만) 호출
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ]);
    setValue("toDo", ""); //제출 시 칸 비움
  };

  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", {
          required: "Please write a To Do",
        })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  );
}

export default CreateToDo;
