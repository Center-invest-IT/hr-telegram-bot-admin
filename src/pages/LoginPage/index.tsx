import { zodResolver } from '@hookform/resolvers/zod';
import { SmartToy, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../../shared/store/use-auth-store.ts';

const schema = z.object({
  username: z
    .string()
    .min(
      4,
      'Введите корректный логин (только латиница и цифры, минимум 4 символа)'
    )
    .regex(/^[a-zA-Z0-9]+$/, 'Только латиница и цифры, минимум 4 символа'),
  password: z
    .string()
    .min(6, 'Пароль минимум 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Только латиница и цифры, минимум 4 символа'),
});

type LoginFormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const handleClickShowPassword = () => {
    if (inputRef.current) {
      const { selectionStart } = inputRef.current;
      setShowPassword(!showPassword);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = selectionStart;
        }
      });
    } else {
      setShowPassword(!showPassword);
    }
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Отправка данных:', data);
      await login(data.username, data.password);
      navigate('/');
    } catch (err) {
      console.error('Ошибка авторизации', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'info.main' }}>
          <SmartToy />
        </Avatar>

        <Typography component="h1" variant="h5">
          Вход в систему
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            autoComplete="username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <FormControl margin="normal" fullWidth variant="outlined">
            <InputLabel htmlFor="password-field" error={!!errors.password}>
              Пароль
            </InputLabel>
            <OutlinedInput
              id="password-field"
              inputRef={inputRef}
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              label="Пароль"
              {...register('password')}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )}
            />
            {errors.password && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.password.message}
              </Typography>
            )}
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
