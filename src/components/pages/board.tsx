import * as React from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd';
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
  yellow,
  purple,
  blue,
  red,
  green,
  orange,
  black,
  sky,
  pink,
  lime,
  null
}

const Container = styled.div`
  display: flex;
`;

export interface IBoardPageProps {
  cards: IBoardCard[];
  lists: IBoardList[];
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

    if (start.id === finish.id) {
      // move within list

      /*
      For example, if you want to insert Card C between Card A and Card B:
      Card A - Pos 16
      Card B - Pos 32
      Card C - Pos 64
      (16 + 32) / 2 = 24. Set Card C Pos to 24.

      Card A - Pos 16
      Card C - Pos 24
      Card B - Pos 32
      */

      // const newState = produce(this.state, draftState => {
      //   const cards = draftState.cards
      //     .filter(card => card.idList === finish.id)
      //     .sort((a, b) => a.pos - b.pos);
      //
      //   const cardAboveDestination = destination.index > 0 ? cards[destination.index - 1] : null;
      //   const cardBelowDestination =
      //     destination.index < cards.length - 1 ? cards[destination.index + 1] : null;
      //
      //   const draggingCard = cards.find(card => card.id === draggableId)!;
      //
      //   console.log(
      //     cardAboveDestination && cardAboveDestination.pos,
      //     draggingCard.pos,
      //     cardBelowDestination && cardBelowDestination.pos
      //   );
      //   console.log(cards.length);
      //   console.log(destination.index);
      //
      //   if (cardAboveDestination === null && cardBelowDestination !== null) {
      //     console.log('TOP');
      //     // at the top
      //     draggingCard.pos = cardBelowDestination.pos - 65535;
      //   } else if (cardBelowDestination === null && cardAboveDestination !== null) {
      //     console.log('BOTTOM');
      //     // at the bottom
      //     draggingCard.pos = cardAboveDestination.pos + 65535;
      //   } else if (cardBelowDestination === null && cardAboveDestination === null) {
      //     console.log('ONLY');
      //     // first in list
      //     draggingCard.pos = 65535;
      //   } else {
      //     console.log('IN BETWEEN');
      //     // in between other cards
      //     draggingCard.pos = (cardAboveDestination!.pos + cardBelowDestination!.pos) / 2;
      //   }
      //
      //   console.log(draggingCard.pos);
      //
      //   return draftState;
      // });

      const newState = produce(this.state, draftState => {
        const startList = draftState.lists.find(list => list.id === start.id)!;

        startList.cardIds = produce(startList.cardIds, cardIds => {
          cardIds.splice(source.index, 1);
          cardIds.splice(destination.index, 0, draggableId);
        });
      });

      this.setState(newState);
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
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {/* TODO: Order lists properly */}
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

// const BoardPage: React.FC<IBoardPageProps> = props => {
//   return (
//     <div>
//       {props.cards.map((card, i) => (
//         <div key={i} style={{ padding: 10 }}>
//           <h3>{card.name}</h3>
//           <div>
//             {card.labels.map((label, labelI) => (
//               <div key={labelI}>{label.name}</div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

//   return <div>{props.cards.map((card, i) => {
//       return <div key={i} style={{ padding: 10 }}>
//           <h3>{card.name}</h3>
//           <div>
//               {card.labels.map((label, labelI) => {
//                   return <div key={labelI}>
//                       {label.name}
//                   </div>
//               })}
//           </div>
//       </div>
//   })}</div>;
// };

export default BoardPage;
