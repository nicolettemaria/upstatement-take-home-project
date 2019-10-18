import * as React from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import List from '../molecules/list';
import produce from 'immer';

export interface IBoardList {
  id: string; // ID of the list
  name: string; // name of the list
  closed: boolean; // whether the list is closed
  idBoard: string; // ID of the board the list is on
  pos: number; // position of the list on the board

  cardIds: string[];
}

export interface IBoardCard {
  id: string; // ID of the card
  name: string; // name of the card
  description: string; // description for the card
  closed: boolean; // whether the card is closed
  labels: IBoardLabel[]; // array of label objects on the card
  idList: string; // ID of the list the card is in
  pos: number; // position of the card in the list
}

export interface IBoardLabel {
  id: string; // ID of the label
  name: string; // optional name of the label
  idBoard: string; // ID of the board the card is on
  color: ELabelColor; // color of the label
}

export enum ELabelColor {
  yellow = 'yellow',
  purple = 'purple',
  blue = 'blue',
  red = 'red',
  green = 'green',
  orange = 'orange',
  black = 'black',
  sky = 'sky',
  pink = 'pink',
  lime = 'lime',
  null = 'null'
}

export function labelColorToString(color: ELabelColor): string | null {
  switch (color) {
    case ELabelColor.yellow:
      return '#e0c217';
    case ELabelColor.purple:
      return '#c377e0';
    case ELabelColor.blue:
      return '#0079bf';
    case ELabelColor.red:
      return '#eb5a46';
    case ELabelColor.green:
      return '#61bd4f';
    case ELabelColor.orange:
      return '#ff9f1a';
    case ELabelColor.sky:
      return '#00c2e0';
    case ELabelColor.pink:
      return '#ff78cb';
    case ELabelColor.lime:
      return '#51e898';
    case ELabelColor.black:
      return '#344563';
    case ELabelColor.null:
      return null;
  }
}

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

export interface IBoardPageProps {
  cards: IBoardCard[];
  lists: IBoardList[];

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

  onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = this.state.lists.find(list => list.id === source.droppableId)!;
    const finish = this.state.lists.find(list => list.id === destination.droppableId)!;

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

    if (start.id === finish.id) {
      // move within list
      const newState = produce(this.state, draftState => {
        const startList = draftState.lists.find(list => list.id === start.id)!;

        startList.cardIds = produce(startList.cardIds, cardIds => {
          cardIds.splice(source.index, 1);
          cardIds.splice(destination.index, 0, draggableId);
        });
      });

      this.setState(newState);
      const destinationList = newState.lists.find(list => list.id === finish.id)!;
      this.props.moveCard(
        newState.cards.find(card => card.id === draggableId)!,
        getCardAboveMovedCard(draggableId, destinationList, newState.cards),
        getCardBelowMovedCard(draggableId, destinationList, newState.cards),
        destinationList.id
      );
      return;
    }

    // move between lists
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

    this.setState(newState);
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
    );
  }
}

export default BoardPage;
