// import { apiErrorHandle } from './apiErrorHandler';

import { apiBots } from './config.ts';
import type { newQuestionType } from '../../pages/BotPage/components/TabQuestionsCreate/TabQuestions.tsx';

export const getBots = async () => {
  const response = await apiBots.get('/bots');
  return response.data;
};

export const getBotInfo = async (botId: string) => {
  const response = await apiBots.get(`/bots/${botId}`);
  return response.data;
};

// поменять botData когда будет не фэйк api
export const createNewBot = async (botData: {
  id: string;
  name: string;
  isOnline: boolean;
  newMessagesCount: number;
  createdAt: number;
  // token: string;
  // description?: string;
}) => {
  // name: data.name.trim(),
  //             id: Date.now().toString(),
  //             isOnline: false,
  //             newMessagesCount: 0,
  //             createdAt: Date.now(),
  const payload = {
    ...botData,
    // name: botData.name.trim(),
    // id: Date.now().toString(),
    // isOnline: false,
    // newMessagesCount: 0,
    // createdAt: Date.now(),
  };

  const response = await apiBots.post('/bots', payload);
  return response.data;
};


export interface UpdateBotProps {
  // id: string,
  name: string,
  botId: number;
  token: string;
  description: string;
  isActive: boolean;

}

export const updateBot = async (botId: number, updatedFields: Partial<UpdateBotProps>) => {
  const response = await apiBots.put(`/bots/${botId}`, updatedFields);
  return response.data;
};

export const deleteBot = async (botId: number) => {
  // const response = await apiBots.delete(`/bots/${botId}/botinfo`);
  // return response.data[0];
};

// Responses
export const getResponses = async (botId: string) => {
  const response = await apiBots.get(`responses?botId=${botId}`);
  return response.data;
};
// Responses Questions
export const getQuestions = async (botId: string) => {
  const response = await apiBots.get(`questions?botId=${botId}`);
  return response.data;
};

export const createQuestions = async (newQuestionData: newQuestionType) => {
  const response = await apiBots.post('questions', newQuestionData);
  return response.data;
};

// export const updateQuestions = async (botId: string) => {
//   const response = await apiBots.get(`responses?botId=${botId}`);
//   return response.data;
// };

export const deleteQuestions = async (botId: string) => {
  const response = await apiBots.get(`responses?botId=${botId}`);
  return response.data;
};
