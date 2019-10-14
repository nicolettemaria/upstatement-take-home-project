export interface ITrelloState {
  cards: ITrelloCard[];
  lists: ITrelloList[];
}

export interface ITrelloList {
  id: string; // ID of the list
  name: string; // name of the list
  closed: boolean; // whether the list is closed
  idBoard: string; // ID of the board the list is on
  pos: number; // position of the list on the board
}

export interface ITrelloCard {
  id: string; // ID of the card
  name: string; // name of the card
  description: string; // description for the card
  closed: boolean; // whether the card is closed
  labels: ITrelloLabel[]; // array of label objects on the card
  idList: string; // ID of the list the card is in
  pos: number; // position of the card in the list
}

export interface ITrelloLabel {
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
