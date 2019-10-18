import * as React from 'react';

import { ITrelloState } from './trello';

export interface ITrackedTrelloState {
  timeRequested: Date;
  state: ITrelloState;
}

export interface ITrelloStateManagement extends ITrackedTrelloState {
  timeRequested: Date;
  state: ITrelloState;

  refetch(): Promise<void>;
  moveCard(cardId: string, pos: number, listId?: string): void;
}

// Provide trello state to components.
export default function useTrelloState(): ITrelloStateManagement {
  // Set initial Trello state.
  const [trelloState, setTrelloState] = React.useState<ITrackedTrelloState>({
    timeRequested: new Date(),
    state: {
      cards: [],
      lists: []
    }
  });

  const getNewTrelloState = () => {
    const newQueryTimeRequested = new Date();

    // Wait for network call to return, then set state, else catch error.
    getTrelloState()
      .then(newState => {
        setTrelloState({
          state: newState,
          timeRequested: newQueryTimeRequested
        });
      })
      .catch(e => {
        throw e;
      });
  };

  // Do network call on component mount.
  React.useEffect(() => {
    getNewTrelloState();
  }, []);

  return {
    ...trelloState,
    async moveCard(cardId: string, pos: number, listId?: string): Promise<void> {
      console.log(cardId, pos, listId);
      await moveTrelloCard(cardId, pos, listId);
      await getNewTrelloState();
    },
    async refetch(): Promise<void> {
      await getNewTrelloState();
    }
  };
}

const baseParams = `key=${process.env.REACT_APP_TRELLO_API_KEY}&token=${process.env.REACT_APP_TRELLO_DEBUG_TOKEN}`;

// Retrieve trello state via network call.
async function getTrelloState(): Promise<ITrelloState> {
  const baseURL = `https://api.trello.com/1/boards/${process.env.REACT_APP_TRELLO_SELECTED_BOARD_ID}`;

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

async function moveTrelloCard(cardId: string, pos: number, listId?: string): Promise<void> {
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?pos=${pos}${
      listId ? `&idList=${listId}` : ''
    }&${baseParams}`,
    {
      method: 'PUT'
    }
  );
}
