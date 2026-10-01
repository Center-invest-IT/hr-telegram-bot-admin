import type { Answers, BotCardInfoType, QuestionType } from '../types/apiTypes.ts';

export const initialBots: BotCardInfoType[] = [
  { id: '1', name: 'HR-анкета', token: 'demo-token-hr', description: 'Первичный сбор данных кандидата и согласий на обработку персональных данных.', isOnline: true, newMessagesCount: 12, createdAt: '2025-06-18T09:30:00.000Z' },
  { id: '2', name: 'Карьера в банке', token: 'demo-token-career', description: 'Навигация по вакансиям и ответы на частые вопросы соискателей.', isOnline: true, newMessagesCount: 4, createdAt: '2025-06-20T12:15:00.000Z' },
  { id: '3', name: 'Стажировки', token: 'demo-token-intern', description: 'Регистрация кандидатов на программы практики и стажировки.', isOnline: false, newMessagesCount: 0, createdAt: '2025-06-24T15:45:00.000Z' },
];

export const initialQuestions: QuestionType[] = [
  { id: 'q1', botId: '1', text: 'На какую позицию вы откликаетесь?', answers: ['Frontend-разработчик', 'Аналитик', 'Менеджер по работе с клиентами'] },
  { id: 'q2', botId: '1', text: 'Какой формат работы вам подходит?', answers: ['Офис', 'Гибридный формат', 'Удалённый формат'] },
  { id: 'q3', botId: '1', text: 'Когда готовы приступить к работе?', answers: ['В течение недели', 'В течение месяца', 'Позже месяца'] },
];

export const initialResponses: Answers[] = [
  { questionId: 'q1', botId: '1', title: 'На какую позицию вы откликаетесь?', countResponse: 28, newResponse: 6, answers: [
    { id: 'a1', userId: 'candidate-1', username: 'Алексей', response: 'Frontend-разработчик', date: 'Сегодня, 10:42' },
    { id: 'a2', userId: 'candidate-2', username: 'Мария', response: 'Аналитик', date: 'Сегодня, 09:18' },
    { id: 'a3', userId: 'candidate-3', username: 'Илья', response: 'Frontend-разработчик', date: 'Вчера, 17:06' },
  ] },
  { questionId: 'q2', botId: '1', title: 'Какой формат работы вам подходит?', countResponse: 25, newResponse: 3, answers: [
    { id: 'a4', userId: 'candidate-4', username: 'Екатерина', response: 'Гибридный формат', date: 'Сегодня, 08:54' },
    { id: 'a5', userId: 'candidate-5', username: 'Данил', response: 'Офис', date: 'Вчера, 15:31' },
  ] },
  { questionId: 'q3', botId: '1', title: 'Когда готовы приступить к работе?', countResponse: 21, newResponse: 0, answers: [
    { id: 'a6', userId: 'candidate-6', username: 'София', response: 'В течение месяца', date: 'Вчера, 11:25' },
  ] },
];
