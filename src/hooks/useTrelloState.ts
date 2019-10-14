import * as React from 'react';

import { ITrelloState } from './trello';

export interface ITrelloStateManagement {
  state: ITrelloState;
}

// provide trello state to components
export default function useTrelloState(): ITrelloStateManagement {
  // set initial Trello state
  const [trelloState, setTrelloState] = React.useState<ITrelloState>({
    cards: [],
    lists: []
  });

  // do network call on component mount
  React.useEffect(() => {
    // wait for network call to return, then set state, else catch error
    getTrelloState()
      .then(newState => {
        setTrelloState(newState);
      })
      .catch(e => {
        throw e;
        // TODO surface to the user an error occurred
      });
  }, []);

  return {
    state: trelloState
  };
}

// retrieve trello state via network call
async function getTrelloState(): Promise<ITrelloState> {
  const baseURL = `https://api.trello.com/1/boards/${process.env.REACT_APP_TRELLO_SELECTED_BOARD_ID}`;
  const baseParams = `key=${process.env.REACT_APP_TRELLO_API_KEY}&token=${process.env.REACT_APP_TRELLO_DEBUG_TOKEN}`;

  const [cardResponse, listResponse] = await Promise.all([
    fetch(`${baseURL}/cards?${baseParams}`),
    fetch(`${baseURL}/lists?${baseParams}`)
  ]);
  const [cards, lists] = await Promise.all([cardResponse.json(), listResponse.json()]);

  console.log(cards, lists);

  return {
    cards,
    lists
  };
}
