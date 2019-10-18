import * as React from 'react';
import styled from 'styled-components';
import Card from '../atoms/card';
import {Droppable} from 'react-beautiful-dnd';
import {IBoardCard, IBoardList} from '../lib';

const Container = styled.div`
  margin: 8px;
  width: 272px;
  text-align: left;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 15px 15px 2px 15px;
  font-size: 15px;
  font-weight: 600;
`;

interface ICardListProps {
  isDraggingOver: boolean;
}

const CardList = styled.div<ICardListProps>`
  position: relative;
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

interface IEmptyPlaceholderColumnProps {
  active: boolean;
}

const EmptyPlaceholderColumn = styled.div<IEmptyPlaceholderColumnProps>`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;

  pointer-events: none;
  width: 272px;
  height: 100px;
  border-radius: 3px;
  background-color: #70797d;
  opacity: ${props => (props.active ? 0.05 : 0)};
  transition: opacity 0.25s;
`;

export interface IListProps {
  list: IBoardList;
  cards: IBoardCard[];
}

const List:React.FC<IListProps> = props => {

    // Droppable is used for tracking drag and drop events.
    return (
        <Container>
            <Title>{props.list.name}</Title>
            <Droppable droppableId={props.list.id}>
                {(provided, snapshot) => (
                    <CardList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        <EmptyPlaceholderColumn
                            active={props.cards.length === 0 && !snapshot.isDraggingOver}
                        />
                        {props.cards.map((card, index) => (
                            <Card key={card.id} card={card} index={index}/>
                        ))}
                        {provided.placeholder}
                    </CardList>
                )}
            </Droppable>
        </Container>
    );
};

export default List;
