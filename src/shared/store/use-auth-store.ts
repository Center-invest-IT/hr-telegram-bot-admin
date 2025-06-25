import axios from 'axios';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { apiAuth } from '../api/config.ts';
import { fetchLogin } from '../api/apiAuth.ts';

interface iInitialState {
  isLoading: boolean;
  isAuth: boolean;
  token: string | null;
}

interface IActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface IAuthState extends iInitialState, IActions { }

const initialState: iInitialState = {
  isLoading: false,
  isAuth: false,
  token: null,
};


const authStore: StateCreator<
  IAuthState,
  [['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set) => ({
  ...initialState,
  login: async (username, password) => {
    set({ isLoading: true }, false, 'login');
    try {
      // Кодируем логин и пароль в Base64 для Basic Auth
      const token = btoa(`${username}:${password}`);

      // Проверяем валидность токена, делая тестовый запрос
      // const response = await fetchLogin(token);

      // if (response.status === 200) {
      //   set({ isAuth: true, token }, false, 'login/success');
      // } else {
      //   throw new Error('Authentication failed');
      // }
      set({ isAuth: true, token }, false, 'login/success');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      set({ isAuth: false, token: null }, false, 'login/failed');
      throw error; // Пробрасываем ошибку для обработки в UI
    } finally {
      set({ isLoading: false }, false, 'login/finally');
    }
  },
  logout: () => {
    //   delete api.defaults.headers.common.Authorization;
    set({ isAuth: false, token: null });
  },
});
export const useAuthStore = create<IAuthState>()(
  devtools(
    persist(authStore, {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isAuth: state.isAuth, token: state.token }),
    }),
  ),
);

export const useIsAuth = () => useAuthStore((state) => state.isAuth);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const login = (email: string, password: string) =>
  useAuthStore.getState().login(email, password);
export const logout = () => useAuthStore.getState().logout();
