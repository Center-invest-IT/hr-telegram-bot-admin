import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
// import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const mainListItems = [
  { text: 'Боты', icon: <HomeRoundedIcon />, to: '/' },
  { text: 'Новый бот', icon: <AnalyticsRoundedIcon />, to: '/add-bot' },
  // { text: 'Clients', icon: <PeopleRoundedIcon />, to: '/clients' },
  // { text: 'Tasks', icon: <AssignmentRoundedIcon />, to: '/tasks' },
];

const secondaryListItems = [
  { text: 'Настройки', icon: <SettingsRoundedIcon />, to: '/' },
];

export const SideBarList: React.FC = () => {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem
            key={`main-${item.text}`}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem
            key={`secondary-${item.text}`}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};
