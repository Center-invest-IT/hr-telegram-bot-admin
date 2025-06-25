import { apiAuth } from './config.ts';

export const fetchLogin = async (token: string) => {
  const response = await apiAuth.post('', {
    headers: {
      Authorization: `Basic ${token}`
    }
  });
  return response.data;
};
