import * as React from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import List from '../molecules/list';
import produce from 'immer';
import TimeAgo from 'react-timeago';
import { IBoardCard, IBoardList } from '../lib';

const Container = styled.div`
  white-space: nowrap;
  overflow-x: scroll;
  min-height: 75vh;

  & > * {
    display: inline-block;
    white-space: normal;
    vertical-align: top;
  }
`;

const BoardTitle = styled.h1`
  display: inline-block;
  font-weight: 600;
  text-align: left;
  margin-bottom: 15px;
`;

const RefreshBanner = styled.div`
  display: inline-block;
  margin-left: 20px;
  opacity: 0.4;
`;

const RefreshButton = styled.a`
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

export interface IBoardPageProps {
  cards: IBoardCard[];
  lists: IBoardList[];
  lastFetchDate: Date;

  refetch(): Promise<void>;
  moveCard(
    cardToMove: IBoardCard,
    cardAbove: IBoardCard | null,
    cardBelow: IBoardCard | null,
    listId?: string
  ): void;
}

export interface IBoardPageState {
  cards: IBoardCard[];
  lists: IBoardList[];
}

class BoardPage extends React.Component<IBoardPageProps, IBoardPageState> {
  constructor(props: IBoardPageProps) {
    super(props);

    this.state = {
      cards: props.cards,
      lists: props.lists
    };
  }

  // Updates local state after dragging a card, then updates Trello state.
  onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Origin list of card.
    const start = this.state.lists.find(list => list.id === source.droppableId)!;
    // Destination list of card.
    const finish = this.state.lists.find(list => list.id === destination.droppableId)!;

    // Gets card above moved card to determine new position of card in list.
    const getCardAboveMovedCard = (
      movedCardId: string,
      inList: IBoardList,
      cards: IBoardCard[]
    ): IBoardCard | null => {
      const movedIndex = inList.cardIds.indexOf(movedCardId);

      if (movedIndex > -1) {
        return movedIndex === 0
          ? null
          : cards.find(card => card.id === inList.cardIds[movedIndex - 1])!;
      } else {
        throw new Error('Moved card not found in list.');
      }
    };

    // Gets card below moved card to determine new position of card in list.
    const getCardBelowMovedCard = (
      movedCardId: string,
      inList: IBoardList,
      cards: IBoardCard[]
    ): IBoardCard | null => {
      const movedIndex = inList.cardIds.indexOf(movedCardId);

      if (movedIndex > -1) {
        return movedIndex === inList.cardIds.length - 1
          ? null
          : cards.find(card => card.id === inList.cardIds[movedIndex + 1])!;
      } else {
        throw new Error('Moved card not found in list.');
      }
    };

    // Moves card within a list.
    if (start.id === finish.id) {
      const newState = produce(this.state, draftState => {
        const startList = draftState.lists.find(list => list.id === start.id)!;

        startList.cardIds = produce(startList.cardIds, cardIds => {
          cardIds.splice(source.index, 1);
          cardIds.splice(destination.index, 0, draggableId);
        });
      });

      // Sets local state.
      this.setState(newState);
      // Sets remote state.
      const destinationList = newState.lists.find(list => list.id === finish.id)!;
      this.props.moveCard(
        newState.cards.find(card => card.id === draggableId)!,
        getCardAboveMovedCard(draggableId, destinationList, newState.cards),
        getCardBelowMovedCard(draggableId, destinationList, newState.cards),
        destinationList.id
      );
      return;
    }

    // Moves card between lists.
    const newState = produce(this.state, draftState => {
      const startList = draftState.lists.find(list => list.id === start.id)!;

      startList.cardIds = produce(startList.cardIds, cardIds => {
        cardIds.splice(source.index, 1);
      });

      const finishList = draftState.lists.find(list => list.id === finish.id)!;

      finishList.cardIds = produce(finishList.cardIds, cardIds => {
        cardIds.splice(destination.index, 0, draggableId);
      });
    });

    // Sets local state.
    this.setState(newState);
    // Sets remote state.
    const destinationList = newState.lists.find(list => list.id === finish.id)!;
    this.props.moveCard(
      newState.cards.find(card => card.id === draggableId)!,
      getCardAboveMovedCard(draggableId, destinationList, newState.cards),
      getCardBelowMovedCard(draggableId, destinationList, newState.cards),
      destinationList.id
    );
  };

  render() {
    return (
      <div>
        <BoardTitle>✏ Lorem Ipsum Task Board</BoardTitle>
        <RefreshBanner>
          Updated{' '}
          <TimeAgo
            date={this.props.lastFetchDate}
            formatter={(value, unit, suffix) => {
              if (unit === 'second') {
                return 'just now';
              } else {
                return value + ' ' + unit + (value > 1 ? 's' : '') + ' ' + suffix;
              }
            }}
          />
          , <RefreshButton onClick={this.props.refetch}>refresh</RefreshButton>
        </RefreshBanner>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>
            {this.state.lists.map(list => {
              const cards = list.cardIds.map(
                cardId => this.state.cards.find(card => card.id === cardId)!
              );
              return <List key={list.id} list={list} cards={cards} />;
            })}
          </Container>
        </DragDropContext>
      </div>
    );
  }
}

export default BoardPage;
