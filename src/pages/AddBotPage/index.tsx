import { Box, Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { createNewBot } from '../../shared/api/apiBot.ts';
import { addNotification } from '../../shared/store/use-notification-store.ts';
import { Header } from '../../shared/ui/Header.tsx';
import { useNavigate } from 'react-router-dom';

interface Bot {
  name: string;
  token: string;
  description?: string;
}

const AddBot: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<Bot>({ mode: 'onChange' });

  const onSubmit = async (data: Bot) => {
    try {
      const payload = {
        name: data.name.trim(),
        token: data.token.trim(),
        description: data.description?.trim() || 'Описание не указано',
      };
      const bot = await createNewBot(payload);

      addNotification('Бот успешно добавлен!', 'success', 6000);
      reset();
      navigate(`/bots/${bot.id}`);
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        'error',
        6000
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      maxWidth={600}
    >
      <Header title="Добавить Бота" />
      <Stack spacing={3}>
        <TextField
          required
          label="Название бота"
          fullWidth
          variant="standard"
          {...register('name', {
            required: 'Имя обязательно',
            maxLength: {
              value: 64,
              message: 'Максимум 64 символа',
            },
            validate: (value) =>
              value.trim().length > 0 ||
              'Название не может быть пустым',
          })}
          error={!!errors.name}
          helperText={errors.name?.message?.toString() || ''}
        />

        <TextField
          required
          label="Токен от BotFather"
          fullWidth
          variant="standard"
          {...register('token', {
            required: 'Токен обязателен',
            validate: (value) =>
              value.trim().length > 0 ||
              'Токен не может быть пустым',
          })}
          error={!!errors.token}
          helperText={errors.token?.message?.toString() || ''}
        />

        <TextField
          label="Описание"
          multiline
          rows={3}
          fullWidth
          variant="standard"
          {...register('description')}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={!isValid}
          color="primary"
          fullWidth
          size="large"
        >
          Добавить
        </Button>
      </Stack>
    </Box>
  );
};

export default AddBot;
