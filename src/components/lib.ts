export interface IBoardList {
  id: string; // ID of the list
  name: string; // name of the list
  closed: boolean; // whether the list is closed
  idBoard: string; // ID of the board the list is on
  pos: number; // position of the list on the board
  cardIds: string[]; // IDs of cards in list
}

export interface IBoardCard {
  id: string; // ID of the card
  name: string; // name of the card
  description: string; // description for the card
  closed: boolean; // whether the card is closed
  labels: IBoardLabel[]; // array of label objects on the card
  idList: string; // ID of the list the card is in
  pos: number; // position of the card in the list
}

export interface IBoardLabel {
  id: string; // ID of the label
  name: string; // optional name of the label
  idBoard: string; // ID of the board the card is on
  color: ELabelColor; // color of the label
}

export enum ELabelColor {
  yellow = 'yellow',
  purple = 'purple',
  blue = 'blue',
  red = 'red',
  green = 'green',
  orange = 'orange',
  black = 'black',
  sky = 'sky',
  pink = 'pink',
  lime = 'lime',
  null = 'null'
}

export function labelColorToString(color: ELabelColor): string | null {
  switch (color) {
    case ELabelColor.yellow:
      return '#e0c217';
    case ELabelColor.purple:
      return '#c377e0';
    case ELabelColor.blue:
      return '#0079bf';
    case ELabelColor.red:
      return '#eb5a46';
    case ELabelColor.green:
      return '#61bd4f';
    case ELabelColor.orange:
      return '#ff9f1a';
    case ELabelColor.sky:
      return '#00c2e0';
    case ELabelColor.pink:
      return '#ff78cb';
    case ELabelColor.lime:
      return '#51e898';
    case ELabelColor.black:
      return '#344563';
    case ELabelColor.null:
      return null;
  }
}
