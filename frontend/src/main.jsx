import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#121212',
      light: '#ffffff',
      dark: '#121212',
      contrastText: '#000000',
    },
    secondary: {
      main: '#dc004e',
    },
    success: { 
      main: '#b6de3d', 
      light: '#d0e68c', 
      dark: '#96b42d', 
      contrastText: '#ffffff', 
    },
    error: { 
      main: '#f44336', 
      light: '#e57373', 
      dark: '#d32f2f', 
      contrastText: '#ffffff', 
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#b6de3d',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#96b42d',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#b6de3d',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Nunito Sans,Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 'bold',
      lineHeight: '4rem',
      color: '#121212',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      lineHeight: '3.5rem',
      color: '#121212',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 'bold',
      lineHeight: '3rem',
      color: '#121212',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      lineHeight: '3rem',
      color: '#121212',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      lineHeight: '2.5rem',
      color: '#121212',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      lineHeight: '2rem',
      color: '#121212',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      color: '#121212',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      color: '#121212',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      color: '#121212',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      color: '#121212',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
