import { ITrelloState } from './trello';

export interface ITrelloStateManagement {
  state: ITrelloState;
}

export default function useTrelloState(): ITrelloStateManagement {
  return {
    state: {
      cards: [],
      lists: []
    }
  };
}
