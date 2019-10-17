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
      cards={filteredCards}
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
      moveCard={(cardToMove, afterCard, listId) => {
        // calculate new position, pass to trello hook
        trelloStateManagement.moveCard(cardToMove.id, afterCard ? afterCard.pos + 1 : 0, listId);
      }}
    />
  );
};

export default ConnectedBoardPage;
