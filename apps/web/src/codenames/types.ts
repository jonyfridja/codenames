export type Team = "red" | "blue";

export type CardRole = Team | "neutral" | "assassin";

export interface Card {
  id: number;
  word: string;
  role: CardRole;
  revealed: boolean;
}

export interface BoardState {
  activeTeam: Team;
  cards: Card[];
  startingTeam: Team;
  winner: Team | null;
}
