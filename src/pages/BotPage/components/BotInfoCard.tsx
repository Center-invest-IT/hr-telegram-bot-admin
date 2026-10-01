import { Cancel, CheckCircle, Delete, Edit, Save } from '@mui/icons-material';
import {
  Box, Button, Chip, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  TextField, Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteBot, updateBot } from '../../../shared/api/apiBot.ts';
import { addNotification } from '../../../shared/store/use-notification-store.ts';
import type { ApiError } from '../../../shared/api/errorHandler.ts';
import { useNavigate } from 'react-router-dom';
import type { BotCardInfoType } from '../../../shared/types/apiTypes.ts';


interface BotInfoCardProps {
  bot: BotCardInfoType;
}

export const BotInfoCard: React.FC<BotInfoCardProps> = ({ bot }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [botToDelete, setBotToDelete] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset,
    formState: { errors, isDirty, isValid } } = useForm<BotCardInfoType>({
      defaultValues: bot,
      mode: 'onChange',
    });

  // console.log(bot)

  const handleEdit = () => {
    reset(bot);
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      await deleteBot(id);
      addNotification('Бот успешно удален', 'success', 3000);
      navigate('/');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      addNotification(apiError.message, 'error', 6000);
    } finally {
      setBotToDelete(false);
    }
  };

  const handleDeleteClick = () => {
    setBotToDelete(true);
  };

  const onSubmit = async (data: BotCardInfoType) => {
    try {
      await updateBot(bot.id, {
        name: data.name,
        token: data.token,
        description: data.description,
      });
      setIsEditing(false);
      reset(data);
      addNotification('Изменения сохранены', 'success', 3000);

    } catch (error: unknown) {
      const apiError = error as ApiError;
      addNotification(apiError.message, 'error', 6000);
    }
  };

  const renderViewMode = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{bot.name}</Typography>
        <Chip
          sx={{ pointerEvents: 'none' }}
          label={bot.isOnline ? 'Online' : 'Offline'}
          color={bot.isOnline ? 'success' : 'error'}
          icon={bot.isOnline ? <CheckCircle /> : <Cancel />}
        />
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}><strong>ID:</strong> {bot.id}</Typography>

      <Typography variant="body1" sx={{ mt: 2 }}><strong>Token:</strong></Typography>
      <Typography sx={{ fontFamily: 'monospace' }}>{`${bot.token.substring(0, 10)}...`}</Typography>

      <Typography variant="body1" sx={{ mt: 2 }}><strong>Описание:</strong></Typography>
      <Typography sx={{ fontFamily: 'monospace' }}>{bot.description}</Typography>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
          Редактировать
        </Button>
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          startIcon={<Delete />}>
          Удалить бота
        </Button>

      </Box>

      <Dialog disableEnforceFocus
        disableAutoFocus open={botToDelete} onClose={() => setBotToDelete(false)}>
        <DialogTitle>Удалить бота?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить бота <strong>{bot.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBotToDelete(false)}
            color="primary"
          >
            Отмена
          </Button>
          <Button
            onClick={() => handleDelete(bot.id)}
            color="error"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  // handleDelete(botToDelete.id)
  const renderEditMode = () => (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          {...register('name', {
            required: 'Имя обязательно',
            maxLength: { value: 64, message: 'Максимум 64 символа' },
          })}
          fullWidth
          label="Имя бота"
          error={!!errors.name}
          helperText={errors.name?.message?.toString() || ''}
          sx={{ mr: 2 }}
        />
        <Chip
          label={bot.isOnline ? 'Online' : 'Offline'}
          color={bot.isOnline ? 'success' : 'error'}
          icon={bot.isOnline ? <CheckCircle /> : <Cancel />}
        />
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}><strong>ID:</strong> {bot.id}</Typography>

      <TextField
        {...register('token', { required: 'Токен обязателен' })}
        fullWidth
        label="Token"
        error={!!errors.token}
        helperText={errors.token?.message}
        sx={{ mt: 2 }}
      />

      <TextField
        {...register('description')}
        fullWidth
        multiline
        rows={3}
        label="Описание"
        sx={{ mt: 2 }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          type="submit"
          disabled={!isDirty || !isValid}
        >
          Сохранить
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Отмена
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {isEditing ? renderEditMode() : renderViewMode()}
    </Box>
  );
};
