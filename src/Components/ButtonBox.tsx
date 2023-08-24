import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "styled-components";
import {
  faPlus,
  faMoon as faSolidMoon,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon as faRegularMoon } from "@fortawesome/free-regular-svg-icons";
import { useRecoilState } from "recoil";
import { useState, SetStateAction, Dispatch } from "react";
import { isDarkAtom } from "../atoms";

const Wrapper = styled.div`
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

interface IButtonBoxProp {
  setNewBoard: Dispatch<SetStateAction<boolean>>;
}

function ButtonBox({ setNewBoard }: IButtonBoxProp) {
  const [darkAtom, setDarkAtom] = useRecoilState(isDarkAtom);

  return (
    <Wrapper>
      <Button onClick={() => setDarkAtom((prev) => !prev)}>
        <ButtonIcon icon={darkAtom ? faRegularMoon : faSolidMoon} />
      </Button>
      <Button onClick={() => setNewBoard((prev) => !prev)}>
        <ButtonIcon icon={faPlus} />
      </Button>
    </Wrapper>
  );
}

export default ButtonBox;
