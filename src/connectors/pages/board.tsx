import * as React from 'react';
import useTrelloState from '../../hooks/useTrelloState';
import BoardPage from '../../components/pages/board';

const ConnectedBoardPage: React.FC = () => {
  const trelloState = useTrelloState();
  const filteredCards = trelloState.state.cards.filter(card =>
    card.labels.map(label => label.name.toLowerCase()).includes('client')
  );

  return (
    <BoardPage
      key={trelloState.timeRequested.getTime()}
      cards={filteredCards}
      lists={trelloState.state.lists.map(list => ({
        ...list,
        cardIds: filteredCards.filter(card => card.idList === list.id).map(card => card.id)
      })).filter(list => list.cardIds.length > 0 || list.name.toLowerCase() === "for review")}
    />
  );
};

export default ConnectedBoardPage;
