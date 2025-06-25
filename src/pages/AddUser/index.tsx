import {
  Box, Button, FormControl, InputLabel, MenuItem, NativeSelect, Select, Stack,
  TextField, type SelectChangeEvent
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { createNewBot } from '../../shared/api/apiBot.ts';
import { addNotification } from '../../shared/store/use-notification-store.ts';
import { Header } from '../../shared/ui/Header.tsx';

interface Bot {
  name: string;
  token: string;
  description?: string;
}

const AddUser: React.FC = () => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      role: 'user' // Устанавливаем значение по умолчанию
    }
  });

  const onSubmit = async (data: any) => {
    try {
      console.log(data)
      // const payload = {
      //   name: data.name.trim(),
      //   id: Date.now().toString(),
      //   isOnline: false,
      //   newMessagesCount: 0,
      //   createdAt: Date.now(),
      // };
      // createNewBot(payload);

      addNotification('Бот успешно добавлен!', 'success', 6000);
      reset();
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        'error',
        6000
      );
    }
  };

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      maxWidth={600}
    >
      <Header title="Добавить User" />
      <Stack spacing={3}>
        <TextField
          required
          label="Имя пользователя"
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
              'Имя не может быть пустым',
          })}
          error={!!errors.name}
          helperText={errors.name?.message?.toString() || ''}
        />

        <TextField
          required
          label="Пароль"
          fullWidth
          variant="standard"
          {...register('password', {
            required: 'Пароль обязателен',
            validate: (value) =>
              value.trim().length > 0 ||
              'Пароль не может быть пустым',
          })}
          error={!!errors.password}
          helperText={errors.password?.message?.toString() || ''}
        />

        <FormControl fullWidth>
          <InputLabel id="role-select-label">Роль</InputLabel>
          <Select
            label="Роль"
            labelId="role-select-label"
            {...register('role', {
              required: 'Роль обязательна'
            })}
            defaultValue="user"
            error={!!errors.role}
          >
            <MenuItem value="user">Пользователь</MenuItem>
            <MenuItem value="admin">Админ</MenuItem>
            {/* <MenuItem value="Thirty">Thirty</MenuItem> */}
          </Select>
        </FormControl>

        {/* <TextField
          label="Описание"
          multiline
          rows={3}
          fullWidth
          variant="standard"
          {...register('description')}
        /> */}

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

export default AddUser;
