import type { Answers, BotCardInfoType, QuestionType } from '../types/apiTypes.ts';
import { initialBots, initialQuestions, initialResponses } from './demo-data.ts';

const storageKeys = { bots: 'center-invest-demo-bots', questions: 'center-invest-demo-questions', responses: 'center-invest-demo-responses' };
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const read = <T,>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return clone(fallback);
  try { return JSON.parse(stored) as T; } catch { return clone(fallback); }
};
const write = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const demoStore = {
  getBots: () => read<BotCardInfoType[]>(storageKeys.bots, initialBots),
  setBots: (bots: BotCardInfoType[]) => write(storageKeys.bots, bots),
  getQuestions: () => read<QuestionType[]>(storageKeys.questions, initialQuestions),
  setQuestions: (questions: QuestionType[]) => write(storageKeys.questions, questions),
  getResponses: () => read<Answers[]>(storageKeys.responses, initialResponses),
  setResponses: (responses: Answers[]) => write(storageKeys.responses, responses),
};
