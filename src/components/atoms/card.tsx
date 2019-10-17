import * as React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { IBoardCard } from '../pages/board';

interface IContainerProps {
  isDragging: boolean;
}

const Container = styled.div<IContainerProps>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
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
