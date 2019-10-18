import * as React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { ELabelColor, IBoardCard, labelColorToString } from '../lib';

interface IContainerProps {
  isDragging: boolean;
}

const Container = styled.div<IContainerProps>`
  // border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 8px;
  text-align: left;
  box-shadow: ${props =>
    props.isDragging
      ? '0px 15px 15px -10px rgba(0, 0, 0, 0.1)'
      : '0px 2px 2px -2px rgba(0,0,0,0.1)'};
  background-color: white;
`;

interface ITagProps {
  color: string;
}

const TagGroup = styled.div`
  padding-top: 5px;
`;

const Tag = styled.div<ITagProps>`
  position: relative;
  z-index: 0;

  margin: 5px 5px 0 0;
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  color: ${props => props.color};

  &:after {
    z-index: -1;
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    background-color: ${props => props.color};
    opacity: 0.25;
  }
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
          {props.card.labels.length !== 0 && (
            <TagGroup>
              {props.card.labels
                .filter(label => label.color !== ELabelColor.null)
                .map((label, labelI) => (
                  <Tag key={labelI} color={labelColorToString(label.color) || ''}>
                    {label.name}
                  </Tag>
                ))}
            </TagGroup>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default Card;
