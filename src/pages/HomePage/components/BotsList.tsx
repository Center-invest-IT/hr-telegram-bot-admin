import { Cancel, CheckCircle, MessageRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TableComponents } from 'react-virtuoso';
import { TableVirtuoso } from 'react-virtuoso';
import { deleteBot, getBots } from '../../../shared/api/apiBot.ts';
import { type ApiError } from '../../../shared/api/errorHandler.ts';
import { addNotification } from '../../../shared/store/use-notification-store.ts';
import type { BotShortType } from '../../../shared/types/apiTypes.ts';
import { MyDialog } from '../../../shared/ui/MyDialog.tsx';

interface BotRowData {
  id: string;
  botId: string;
  name: string;
  isOnline: boolean;
  newMessagesCount: number;
}

const CustomTableRow: TableComponents<BotRowData>['TableRow'] = ({
  // eslint-disable-next-line react/prop-types
  item,
  ...props
}) => {
  const navigate = useNavigate();

  const handleBotClick = (botId: string) => {
    navigate(`/bots/${botId}`);
  };

  return (
    <TableRow
      {...props}
      hover
      sx={{ cursor: 'pointer' }}
      // eslint-disable-next-line react/prop-types
      onClick={() => handleBotClick(item.botId)}
    />
  );
};

const SkeletonRow = () => (
  <>
    <TableCell sx={{ pointerEvents: 'none' }}>
      <Skeleton variant="text" height={30} />
    </TableCell>
    <TableCell sx={{ pointerEvents: 'none' }}>
      <Skeleton variant="text" height={30} width="80%" />
    </TableCell>
    <TableCell sx={{ pointerEvents: 'none' }}>
      <Skeleton variant="rectangular" width="100%" height={30} />
    </TableCell>
    <TableCell sx={{ pointerEvents: 'none' }}>
      <Skeleton variant="rectangular" width="100%" height={30} />
    </TableCell>
    <TableCell sx={{ pointerEvents: 'none' }}>
      <Skeleton variant="rectangular" width="100%" height={30} />
    </TableCell>
  </>
);

const RowContent = ({
  index,
  row,
  onDeleteClick,
}: {
  index: number;
  row: BotRowData;
  onDeleteClick: (row: BotRowData) => void;
}) => (
  <>
    <TableCell align="left">{index + 1}</TableCell>
    <TableCell align="left">{row.name}</TableCell>
    <TableCell align="center">
      <Chip
        label={row.isOnline === true ? 'Online' : 'Offline'}
        color={row.isOnline === true ? 'success' : 'error'}
        icon={row.isOnline === true ? <CheckCircle /> : <Cancel />}
        sx={{
          width: '100%',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      />
    </TableCell>
    <TableCell align="center">
      {row.newMessagesCount > 0 ? (
        <Chip
          label={row.newMessagesCount}
          color="primary"
          icon={<MessageRounded />}
          sx={{
            width: '100%',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет новых
        </Typography>
      )}
    </TableCell>
    <TableCell align="center">
      <Button
        color="error"
        variant="contained"
        sx={{ width: '100%', justifyContent: 'center' }}
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(row);
        }}
      >
        Удалить
      </Button>
    </TableCell>
  </>
);

function fixedHeaderContent() {
  return (
    <TableRow>
      <TableCell align="left" style={{ width: 20 }}>
        ID
      </TableCell>
      <TableCell align="left" style={{ width: 100 }}>
        Бот
      </TableCell>
      <TableCell align="center" style={{ width: 50 }}>
        Статус
      </TableCell>
      <TableCell align="center" style={{ width: 110 }}>
        Новых сообщений
      </TableCell>
      <TableCell align="center" style={{ width: 90 }}>
        Действия
      </TableCell>
    </TableRow>
  );
}

// Выносим компоненты таблицы за пределы основного компонента
const ScrollerComponent = React.forwardRef<HTMLDivElement>((props, ref) => (
  <TableContainer component={Paper} {...props} ref={ref} />
));

const TableComponent = (props: any) => (
  <Table
    {...props}
    sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}
  />
);

const TableHeadComponent = React.forwardRef<HTMLTableSectionElement>(
  (props, ref) => (
    <TableHead sx={{ background: 'white' }} {...props} ref={ref} />
  )
);

const TableBodyComponent = React.forwardRef<HTMLTableSectionElement>(
  (props, ref) => <TableBody {...props} ref={ref} />
);

const ReactVirtualizedTable = () => {
  const [bots, setBots] = React.useState<BotRowData[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [botToDelete, setBotToDelete] = React.useState<BotRowData | null>(
    null
  );
  const [needsUpdate, setNeedsUpdate] = React.useState<boolean>(false);

  // const navigate = useNavigate();

  // const handleBotClick = (id: string) => {
  //   navigate(`/bots/${id}`);
  // };

  const handleDelete = async (id: string) => {
    try {
      await deleteBot(id);
      setBots((prev) => prev.filter((bot) => bot.botId !== id));
      setNeedsUpdate(true); // Устанавливаем флаг обновления
      addNotification('Бот успешно удален', 'success', 3000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      addNotification(apiError.message, 'error', 6000);
    } finally {
      setBotToDelete(null);
    }
  };

  const handleDeleteClick = (row: BotRowData) => {
    setBotToDelete(row);
  };

  const fetchBots = async () => {
    setIsLoading(true);
    try {
      const response = await getBots();
      const botsShort = response.map((bot: BotShortType) => ({
        id: bot.id,
        botId: bot.id,
        name: bot.name,
        isOnline: bot.isOnline,
        newMessagesCount: bot.newMessagesCount,
      }));
      setBots(botsShort);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      addNotification(apiError.message, 'error', 6000);
      setBots([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBots();
    setNeedsUpdate(false);
  }, [needsUpdate]);

  const VirtuosoTableComponents: TableComponents<BotRowData> = React.useMemo(
    () => ({
      Scroller: ScrollerComponent,
      Table: TableComponent,
      TableHead: TableHeadComponent,
      TableRow: CustomTableRow,
      TableBody: TableBodyComponent,
    }),
    []
  );

  const rowContent = React.useCallback(
    (index: number, botRow: BotRowData) => (
      <RowContent
        index={index}
        row={botRow}
        onDeleteClick={handleDeleteClick}
      />
    ),
    []
  );

  const skeletonRows = React.useMemo(
    () =>
      Array.from({ length: 7 }).map((_, index) => ({
        id: String(index),
        botId: String(index),
        name: '',
        isOnline: false,
        newMessagesCount: 0,
      })),
    []
  );

  const getItemContent = (loadingState: boolean) =>
    (loadingState ? () => <SkeletonRow /> : rowContent);

  return (
    <Paper style={{ height: 500, width: '100%', position: 'relative' }}>
      {!isLoading && bots.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Typography variant="h6" color="error">
            Ошибка загрузки
          </Typography>
        </Box>
      ) : (
        <TableVirtuoso
          data={isLoading ? skeletonRows : bots}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={getItemContent(isLoading)}
        />
      )}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255,255,255,0.0)',
            zIndex: 10,
          }}
        />
      )}
      <MyDialog
        open={!!botToDelete}
        onClose={() => setBotToDelete(null)}
        onConfirm={() => botToDelete && handleDelete(botToDelete.botId)}
        title="Удалить бота?"
        description={
          botToDelete
            ? `Вы уверены, что хотите удалить бота ${botToDelete.name}?`
            : ''
        }
      />
    </Paper>
  );
};

export default ReactVirtualizedTable;
