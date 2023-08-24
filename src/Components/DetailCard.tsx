import { faTag } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "styled-components";
import { ITodo } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Wrapper = styled(motion.div)`
  background-color: ${(props) => props.theme.cardColor};
  height: 120px;
  padding-top: 10px;
  margin-top: 5px;
`;

const SubType = styled.div`
  display: flex;
  margin-top: 5px;
  h1 {
    color: #ff9500;
    font-weight: 500;
    margin-right: 15px;
  }
  span {
    border-bottom: 2px solid #ff9500;
    color: black;
  }
`;

const TagIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;

const SubContent = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  height: 75px;
  margin-top: 10px;
  padding: 5px;
  color: #3a3a3a;
  border-radius: 5px;
  font-size: 15px;
  word-break: break-all;
  overflow-y: auto;
  /* 스크롤 바 css */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #fba326;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #c9c8c8;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
`;

const subCardAnimate = {
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
    display: "block",
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
    transitionEnd: {
      display: "none",
    },
  },
};

interface ISubCardProps {
  isCard: boolean;
  toDo: ITodo;
}

function DetailCard({ isCard, toDo }: ISubCardProps) {
  return (
    <Wrapper
      initial="exit"
      animate={isCard ? "enter" : "exit"}
      variants={subCardAnimate}
    >
      <SubType>
        <h1>
          <TagIcon icon={faTag} />
          분야:
        </h1>
        <span>{toDo.type}</span>
      </SubType>
      <SubContent>{toDo.content}</SubContent>
    </Wrapper>
  );
}

export default DetailCard;
