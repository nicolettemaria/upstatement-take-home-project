import React from 'react';
import ConnectedBoardPage from './connectors/pages/board';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
  padding: 75px 200px 0 200px;
`;

const App: React.FC = () => {
  return (
    <Container>
      <ConnectedBoardPage />
    </Container>
  );
};

export default App;
