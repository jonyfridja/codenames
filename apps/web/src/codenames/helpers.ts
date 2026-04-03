import { ROLES, BASE_WORDS } from "./constants";
import type { BoardState, CardRole, Team } from "./types";

export function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function normalizeWords(words: string[]) {
  const seen = new Set<string>();

  return words.reduce<string[]>((result, word) => {
    const normalized = word.trim().toLowerCase();

    if (!normalized || seen.has(normalized)) {
      return result;
    }

    seen.add(normalized);
    result.push(normalized);
    return result;
  }, []);
}

export function titleCase(word: string) {
  return word.replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

export function otherTeam(team: Team): Team {
  return team === ROLES.red ? ROLES.blue : ROLES.red;
}

function repeatRole(role: CardRole, count: number) {
  return Array.from({ length: count }, () => role);
}

export function createBoard(extraWords: string[]): BoardState {
  const startingTeam: Team = Math.random() < 0.5 ? ROLES.red : ROLES.blue;
  const rolePool = shuffle<CardRole>([
    ...repeatRole(ROLES.red, startingTeam === ROLES.red ? 9 : 8),
    ...repeatRole(ROLES.blue, startingTeam === ROLES.blue ? 9 : 8),
    ...repeatRole(ROLES.neutral, 7),
    ROLES.assassin,
  ]);
  const wordPool = shuffle(normalizeWords([...BASE_WORDS, ...extraWords])).slice(0, 25);

  const cards = wordPool.map((word, index) => ({
    id: index,
    word,
    role: rolePool[index],
    revealed: false,
  }));

  return {
    activeTeam: startingTeam,
    cards,
    startingTeam,
    winner: null,
  };
}

export function getRemainingCounts(boardState: BoardState) {
  return {
    red: boardState.cards.filter((card) => card.role === ROLES.red && !card.revealed).length,
    blue: boardState.cards.filter((card) => card.role === ROLES.blue && !card.revealed).length,
  };
}

export function getBoardStatus(boardState: BoardState) {
  if (boardState.winner) {
    return `${titleCase(boardState.winner)} team wins`;
  }

  return `${titleCase(boardState.activeTeam)} team to act`;
}

export function revealBoardCard(boardState: BoardState, cardId: number): BoardState {
  const targetCard = boardState.cards.find((card) => card.id === cardId);

  if (!targetCard || targetCard.revealed || boardState.winner) {
    return boardState;
  }

  const nextCards = boardState.cards.map((card) => (card.id === cardId ? { ...card, revealed: true } : card));
  const revealedCard = nextCards.find((card) => card.id === cardId);

  if (!revealedCard) {
    return boardState;
  }

  const activeTeam = boardState.activeTeam;
  let nextWinner: Team | null = null;
  let nextActiveTeam = activeTeam;

  if (revealedCard.role === ROLES.assassin) {
    nextWinner = otherTeam(activeTeam);
  } else {
    const nextRemainingCounts = {
      red: nextCards.filter((card) => card.role === ROLES.red && !card.revealed).length,
      blue: nextCards.filter((card) => card.role === ROLES.blue && !card.revealed).length,
    };

    if (nextRemainingCounts.red === 0) {
      nextWinner = ROLES.red;
    } else if (nextRemainingCounts.blue === 0) {
      nextWinner = ROLES.blue;
    } else if (revealedCard.role !== activeTeam) {
      nextActiveTeam = otherTeam(activeTeam);
    }
  }

  return {
    ...boardState,
    activeTeam: nextActiveTeam,
    cards: nextCards,
    winner: nextWinner,
  };
}

export function advanceBoardTurn(boardState: BoardState): BoardState {
  if (boardState.winner) {
    return boardState;
  }

  return {
    ...boardState,
    activeTeam: otherTeam(boardState.activeTeam),
  };
}
