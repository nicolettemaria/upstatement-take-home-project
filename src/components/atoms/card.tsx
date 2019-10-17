import * as React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { IBoardCard } from '../pages/board';

interface IContainerProps {
  isDragging: boolean;
}

const Container = styled.div<IContainerProps>`
  // border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 8px;
  text-align: left;
  box-shadow: ${props => (props.isDragging ? '0px 15px 15px -10px rgba(0, 0, 0, 0.1)' : '0px 2px 2px -2px rgba(0,0,0,0.1)')};
  background-color: white;
`;

export interface ICardProps {
  card: IBoardCard;
  index: number;
}

const Card: React.FC<ICardProps> = props => {
  return (
    <Draggable draggableId={props.card.id} index={props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {props.card.name}
        </Container>
      )}
    </Draggable>
  );
};

export default Card;
