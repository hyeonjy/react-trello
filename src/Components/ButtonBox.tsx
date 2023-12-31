import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "styled-components";
import {
  faBars,
  faPlus,
  faMoon as faSolidMoon,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon as faRegularMoon } from "@fortawesome/free-regular-svg-icons";
import { useRecoilState } from "recoil";
import { SetStateAction, Dispatch, useState } from "react";
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
  @media (max-width: 650px) {
    display: none;
  }
`;

const ButtonIcon = styled(FontAwesomeIcon)`
  font-size: 30px;

  &.bar {
    display: none;
    width: 50px;
    @media (max-width: 650px) {
      display: block;
      cursor: pointer;
    }

    &:hover + nav {
      display: block;
    }
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 20px;
  right: -10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100px;
`;

const DropMenu = styled.nav`
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: none;
  &:hover {
    display: block;
  }
`;

const MenuItem = styled.h1`
  font-size: 15px;
  color: black;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  width: 92px;
  &:first-child {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  &:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:hover {
    background-color: #ddd;
  }
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
      <Menu>
        <ButtonIcon className="bar" icon={faBars} />
        <DropMenu>
          <MenuItem onClick={() => setDarkAtom((prev) => !prev)}>
            {darkAtom ? "라이트모드" : "다크모드"}
          </MenuItem>
          <MenuItem onClick={() => setNewBoard((prev) => !prev)}>
            보드 추가
          </MenuItem>
        </DropMenu>
      </Menu>
    </Wrapper>
  );
}

export default ButtonBox;
