import * as React from 'react';
import styled from 'styled-components';
import Card from '../atoms/card';
import { Droppable } from 'react-beautiful-dnd';
import { IBoardCard, IBoardList } from '../pages/board';

const Container = styled.div`
  margin: 8px;
  width: 272px;
  text-align: left;
  border-radius: 3px;
  background-color: #ebecf0;

  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 15px 15px 2px 15px;
  font-size: 15px;
`;

interface ICardListProps {
  isDraggingOver: boolean;
}

const CardList = styled.div<ICardListProps>`
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

export interface IListProps {
  list: IBoardList;
  cards: IBoardCard[];
}

export default class List extends React.Component<IListProps> {
  render() {
    return (
      <Container>
        <Title>{this.props.list.name}</Title>
        <Droppable droppableId={this.props.list.id}>
          {(provided, snapshot) => (
            <CardList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.cards.map((card, index) => (
                <Card key={card.id} card={card} index={index} />
              ))}
              {provided.placeholder}
            </CardList>
          )}
        </Droppable>
      </Container>
    );
  }
}
