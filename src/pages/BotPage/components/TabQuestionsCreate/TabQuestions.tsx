/* eslint-disable indent */
/* eslint-disable no-console */
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
// import { Question } from './Question.tsx';
import {
  createQuestions,
  deleteQuestion,
  getQuestions,
} from '../../../../shared/api/apiBot.ts';
import { addNotification } from '../../../../shared/store/use-notification-store.ts';
import type { QuestionType } from '../../../../shared/types/apiTypes.ts';
import { MyDialog } from '../../../../shared/ui/MyDialog.tsx';
import { Question } from './Question.tsx';

export interface newQuestionType {
  botId: string;
  text: string;
  answers?: string[];
}

interface FormValues {
  questionText: string;
  answers: { value: string }[];
}

interface TabQuestionsProps {
  botId: string;
}

const TabQuestions: React.FC<TabQuestionsProps> = ({ botId }) => {
  const [dataQuestions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionLoadingId, setQuestionLoadingId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [errorGet, setErrorGet] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(
    null
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      questionText: '',
      answers: [{ value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  });

  const fetchData = async (botIdFetch: string) => {
    setIsLoading(true);
    setErrorGet(false);
    try {
      const response = await getQuestions(botIdFetch);
      setQuestions(response);
    } catch (error) {
      setErrorGet(true);
      addNotification(
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка в Questions',
        'error',
        6000
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(botId);
  }, [botId]);

  const onSubmit = async (data: FormValues) => {
    if (data.answers.some((a) => !a.value.trim())) {
      addNotification('Все ответы должны быть заполнены', 'error', 6000);
      return;
    }

    const newQuestion: newQuestionType = {
      botId,
      text: data.questionText.trim(),
      answers: data.answers.map((a) => a.value.trim()),
    };

    setIsCreating(true);
    try {
      const response = await createQuestions(newQuestion);
      setQuestions((prev) => [response, ...prev]);
      addNotification('Вопрос успешно добавлен!', 'success', 6000);
      reset();
    } catch (error) {
      addNotification(
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при создании вопроса',
        'error',
        6000
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    setQuestionLoadingId(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    try {
      await deleteQuestion(id);
    } catch (error) {
      addNotification(
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при удалении',
        'error',
        6000
      );
      fetchData(botId);
    } finally {
      setQuestionLoadingId(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Управление вопросами
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mb: 4 }}
      >
        <TextField
          label="Текст вопроса"
          fullWidth
          {...register('questionText', {
            required: 'Введите текст вопроса',
          })}
          error={!!errors.questionText}
          helperText={errors.questionText?.message}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Варианты ответов:
        </Typography>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            display="flex"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <TextField
              fullWidth
              {...register(`answers.${index}.value`, {
                required: 'Обязательное поле',
              })}
              error={!!errors.answers?.[index]?.value}
              helperText={errors.answers?.[index]?.value?.message}
              sx={{ mr: index > 1 ? 1 : '72px' }}
            />
            {index > 1 && (
              <IconButton
                sx={{ mr: 3 }}
                onClick={() => remove(index)}
              >
                <Delete color="error" />
              </IconButton>
            )}
          </Box>
        ))}

        <Button
          startIcon={<Add />}
          onClick={() => append({ value: '' })}
          sx={{ mr: 2 }}
          type="button"
        >
          Добавить вариант
        </Button>

        <Button
          variant="contained"
          type="submit"
          disabled={!isValid || isCreating}
        >
          {isCreating ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : null}
          Создать вопрос
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" gutterBottom>
        Созданые вопросы
      </Typography>

      <List>
        {isLoading && (
          <Box sx={{ p: 2 }} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {!isLoading && errorGet && (
          <Box sx={{ p: 2 }}>
            <Typography color="error">
              Ошибка при получении вопросов
            </Typography>
          </Box>
        )}
        {!isLoading &&
          !errorGet &&
          (!dataQuestions || dataQuestions.length === 0) && (
            <Box sx={{ p: 2 }}>Нет вопросов</Box>
          )}
        {!isLoading &&
          !errorGet &&
          dataQuestions?.length > 0 &&
          dataQuestions.map((question) => (
            <Question
              key={question.id}
              question={question}
              onDelete={() => setQuestionToDelete(question.id)}
              loading={questionLoadingId === question.id}
            />
          ))}
      </List>

      <MyDialog
        open={!!questionToDelete}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={() => {
          if (questionToDelete) {
            handleDeleteQuestion(questionToDelete);
            setQuestionToDelete(null);
          }
        }}
        title="Удалить вопрос?"
      />
    </Paper>
  );
};

export default TabQuestions;
