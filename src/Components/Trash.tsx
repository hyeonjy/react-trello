import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { isDarkAtom } from "../atoms";

const TrashBox = styled.div<{ $trashOpen?: boolean }>`
  & > div {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    visibility: ${(prop) => (prop.$trashOpen ? "visible" : "hidden")};
  }
`;

interface ITrashIconProps {
  $isDraggingOver: boolean;
  $darkAtom: boolean;
}

const Icon = styled(FontAwesomeIcon)<ITrashIconProps>`
  font-size: 50px;
  color: ${(props) =>
    props.$isDraggingOver ? "tomato" : props.$darkAtom ? "white" : "#9ab3e6"};
`;

interface ITrash {
  $trashOpen: boolean;
}

function Trash({ $trashOpen }: ITrash) {
  const darkAtom = useRecoilValue(isDarkAtom);

  return (
    <TrashBox $trashOpen={$trashOpen}>
      <Droppable droppableId="trash" type="board">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Icon
              icon={faTrash}
              $isDraggingOver={snapshot.isDraggingOver}
              $darkAtom={darkAtom}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </TrashBox>
  );
}

export default Trash;
