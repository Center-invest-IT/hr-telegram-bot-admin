// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/styles/index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f5cc0' },
    success: { main: '#197a4b' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found!');

createRoot(rootElement).render(
  <BrowserRouter>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
