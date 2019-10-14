import * as React from 'react';
import useTrelloState from '../../hooks/useTrelloState';
import BoardPage from '../../components/pages/board';

const ConnectedBoardPage: React.FC = () => {
  const trelloState = useTrelloState();

  return <BoardPage cards={trelloState.state.cards} lists={trelloState.state.lists} />;
};

export default ConnectedBoardPage;
