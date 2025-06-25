import { QuestionAnswer } from '@mui/icons-material';
import { Box, CircularProgress, List, Paper, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';
// import type { UserAnswer } from './UserResponse.tsx';
import { getResponses } from '../../../../shared/api/apiBot.ts';
import type { Answers } from '../../../../shared/types/apiTypes.ts';
import ResponsesItem from './ResponsesItem.tsx';
import { addNotification } from '../../../../shared/store/use-notification-store.ts';

interface TabUsersResponsesProps {
  botId: string;
}

const TabUsersResponses: React.FC<TabUsersResponsesProps> = ({ botId }) => {
  const [dataResponses, setDataResponses] = useState<Answers[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (idFetch: string) => {
    setLoading(true)
    try {

      const res = await getResponses(idFetch);
      setDataResponses(res);
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        'error',
        6000
      );
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!botId) return;
    fetchData(botId);

  }, [botId]);

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

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <QuestionAnswer fontSize="medium" />
        Ответы пользователей
      </Typography>

      <List>
        {dataResponses.map((usersResponse, i) => (
          <ResponsesItem
            key={`response-${usersResponse.questionId}-${i + 1}`}
            usersResponse={usersResponse}
          />
        ))}
      </List>
    </Paper>
  );
};

export default TabUsersResponses;
