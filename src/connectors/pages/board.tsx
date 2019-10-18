import * as React from 'react';
import useTrelloState from '../../hooks/useTrelloState';
import BoardPage from '../../components/pages/board';

const ConnectedBoardPage: React.FC = () => {
  const trelloStateManagement = useTrelloState();
  const filteredCards = trelloStateManagement.state.cards.filter(card =>
    card.labels.map(label => label.name.toLowerCase()).includes('client')
  );

  return (
    <BoardPage
      key={trelloStateManagement.timeRequested.getTime()}
      cards={filteredCards.map(card => ({
        ...card,
        labels: card.labels.filter(label => label.name.toLowerCase() !== 'client')
      }))}
      lists={trelloStateManagement.state.lists
        .map(list => ({
          ...list,
          cardIds: filteredCards.filter(card => card.idList === list.id).map(card => card.id)
        }))
        .filter(
          list =>
            list.cardIds.length > 0 ||
            ['sprint backlog', 'product backlog', 'for review']
              .map(acceptedName => acceptedName.toLowerCase())
              .includes(list.name.toLowerCase())
        )}
      moveCard={(cardToMove, cardAbove, cardBelow, listId) => {
        // calculate new position, pass to trello hook
        trelloStateManagement.moveCard(
          cardToMove.id,
          cardAbove ? (!cardBelow ? cardAbove.pos + 10 : (cardBelow.pos + cardAbove.pos) / 2) : 0,
          listId
        );
      }}
    />
  );
};

export default ConnectedBoardPage;
