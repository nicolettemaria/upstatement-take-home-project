import React from 'react';
import ConnectedBoardPage from './connectors/pages/board';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
  padding: 75px 200px 0 200px;
`;

const BoardTitle = styled.h1`
  font-weight: 600;
  text-align: left;
  margin-bottom: 15px;
`;

const App: React.FC = () => {
  return (
    <Container>
      <BoardTitle>✏ Lorem Ipsum Task Board</BoardTitle>
      <ConnectedBoardPage />
    </Container>
  );
};

export default App;
