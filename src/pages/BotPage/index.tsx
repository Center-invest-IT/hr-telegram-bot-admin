import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBotInfo } from '../../shared/api/apiBot.ts';
import type { ApiError } from '../../shared/api/errorHandler.ts';
import { addNotification } from '../../shared/store/use-notification-store.ts';
import type { BotCardInfoType } from '../../shared/types/apiTypes.ts';
import { Header } from '../../shared/ui/Header.tsx';
import { BotInfoCard } from './components/BotInfoCard.tsx';
import TabQuestions from './components/TabQuestionsCreate/TabQuestions.tsx';
import TabUsersResponses from './components/TabUserResponses/TabUsersResponses.tsx';

const BotPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [botInfo, setBotInfo] = useState<BotCardInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notCon, setNotCon] = useState(false);


  // Определяем активную вкладку из URL при монтировании
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'responses') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams(
      newValue === 1 ? { tab: 'responses' } : { tab: 'questions' }
    );
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setErrorState(null);

      try {
        const response = await getBotInfo(id);
        setBotInfo(response);
        setNotCon(false);
      } catch (error) {
        const apiError = error as ApiError;
        addNotification(apiError.message, 'error', 6000);
        setNotCon(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Если нет id — сразу показываем ошибку
  if (!id) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        <Typography variant="h6" sx={{ color: 'red' }}>
          Не передан идентификатор бота
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (notCon) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        <Typography variant="h6" sx={{ color: 'red' }}>
          Данные бота не найдены
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Header title="Настройка" />
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          {loading && (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {!loading && errorState && (
            <Typography color="error">{errorState}</Typography>
          )}
          {!loading && !errorState && botInfo && (
            <BotInfoCard bot={botInfo} />
          )}
          {!loading && !errorState && !botInfo && (
            <Typography variant="h6" sx={{ py: 2, color: 'red' }}>
              Данные бота не найдены
            </Typography>
          )}
        </Paper>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Вопросы" />
          <Tab label="Ответы пользователей" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {activeTab === 0 && <TabQuestions botId={id} />}
        {activeTab === 1 && <TabUsersResponses botId={id} />}
      </Box>
    </Box>
  );
};

export default BotPage;
