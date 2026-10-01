import axios from 'axios';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface iInitialState {
    isLoading: boolean;
    isAuth: boolean;
    token: string | null;
}

interface IActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface ITodoState extends iInitialState, IActions {}

const initialState: iInitialState = {
  isLoading: false,
  isAuth: new URLSearchParams(window.location.search).has('demo'),
  token: null,
};

// ---изучить
// Создаем axios instance
export const api = axios.create({
  baseURL: 'https://dummyjson.com', // твой API URL
});
// -=====

const todoStore: StateCreator<
    ITodoState,
    [['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set) => ({
  ...initialState,
  login: async (_email, _password) => {
    set({ isLoading: true }, false, 'login');
    try {
      // const response = await axios.post('https://dummyjson.com/auth/login', {
      //     email,
      //     password,
      // });

      //  const token = response.data.token;
      const token = '1244';
      // const token = response.data.token;
      // Ставим токен в axios instance
      // api.defaults.headers.common.Authorization = `Bearer ${token}`;

      set({ isAuth: true, token }, false, 'login/success');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      set({isAuth: false, token: null }, false, 'login/failed');
    } finally {
      set({ isLoading: false }, false, 'login/finally');
    }
  },
  logout: () => {
    //   delete api.defaults.headers.common.Authorization;
    set({ isAuth: false, token: null });
  },
});
const useTodoStore = create<ITodoState>()(
  devtools(
    persist(todoStore, {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isAuth: state.isAuth, token: state.token }),
    }),
  ),
);

export const useIsAuth = () => useTodoStore((state) => state.isAuth);
export const useIsLoading = () => useTodoStore((state) => state.isLoading);
export const login = (email: string, password: string) =>
  useTodoStore.getState().login(email, password);
export const logout = () => useTodoStore.getState().logout();
