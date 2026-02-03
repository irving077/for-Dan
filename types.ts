
export enum AppState {
  START = 'START',
  COMPLIMENTS = 'COMPLIMENTS',
  REASONS = 'REASONS',
  MEMORIES = 'MEMORIES',
  WISHES = 'WISHES',
  LETTERS = 'LETTERS',
  POEM = 'POEM',
  PROPOSAL_LOADING = 'PROPOSAL_LOADING',
  PROPOSAL = 'PROPOSAL',
  ACCEPTED = 'ACCEPTED'
}

export interface Compliment {
  id: number;
  text: string;
  emoji: string;
}

export interface Memory {
  title: string;
  description: string;
  icon: string;
}

export interface Wish {
  id: number;
  text: string;
  icon: string;
}

export interface Letter {
  id: number;
  title: string;
  content: string;
}
