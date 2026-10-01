import type { newQuestionType } from '../../pages/BotPage/components/TabQuestionsCreate/TabQuestions.tsx';
import type { BotCardInfoType } from '../types/apiTypes.ts';
import { demoStore } from './demo-store.ts';

const delay = () => new Promise<void>((resolve) => {
  window.setTimeout(resolve, 180);
});

export const getBots = async () => {
  await delay();
  return demoStore.getBots();
};

export const getBotInfo = async (botId: string) => {
  await delay();
  const bot = demoStore.getBots().find((item) => item.id === botId);
  if (!bot) throw new Error('Бот не найден');
  return bot;
};

export const createNewBot = async (botData: Pick<BotCardInfoType, 'name' | 'token' | 'description'>) => {
  await delay();
  const bot: BotCardInfoType = {
    ...botData,
    id: crypto.randomUUID(),
    isOnline: false,
    newMessagesCount: 0,
    createdAt: new Date().toISOString(),
  };
  demoStore.setBots([bot, ...demoStore.getBots()]);
  return bot;
};

export const updateBot = async (
  botId: string,
  updatedFields: Partial<Pick<BotCardInfoType, 'name' | 'token' | 'description'>>,
) => {
  await delay();
  const bots = demoStore.getBots();
  const index = bots.findIndex((bot) => bot.id === botId);
  if (index < 0) throw new Error('Бот не найден');
  const updatedBot = { ...bots[index], ...updatedFields };
  bots[index] = updatedBot;
  demoStore.setBots(bots);
  return updatedBot;
};

export const deleteBot = async (botId: string) => {
  await delay();
  const bots = demoStore.getBots();
  if (!bots.some((bot) => bot.id === botId)) throw new Error('Бот не найден');
  demoStore.setBots(bots.filter((bot) => bot.id !== botId));
  demoStore.setQuestions(demoStore.getQuestions().filter((question) => question.botId !== botId));
  demoStore.setResponses(demoStore.getResponses().filter((response) => response.botId !== botId));
};

export const getResponses = async (botId: string) => {
  await delay();
  return demoStore.getResponses().filter((response) => response.botId === botId);
};

export const getQuestions = async (botId: string) => {
  await delay();
  return demoStore.getQuestions().filter((question) => question.botId === botId);
};

export const createQuestions = async (newQuestionData: newQuestionType) => {
  await delay();
  const question = { ...newQuestionData, id: crypto.randomUUID() };
  demoStore.setQuestions([question, ...demoStore.getQuestions()]);
  return question;
};

export const deleteQuestion = async (questionId: string) => {
  await delay();
  demoStore.setQuestions(demoStore.getQuestions().filter((question) => question.id !== questionId));
};
