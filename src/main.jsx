import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a2e', light: '#16213e', dark: '#0f0f1a' },
    secondary: { main: '#e94560', light: '#ff6b6b', dark: '#c73652' },
    background: { default: '#f5f5f7', paper: '#ffffff' },
    success: { main: '#00b894' },
    warning: { main: '#fdcb6e' },
    info: { main: '#0984e3' },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: '10px 24px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #16213e 0%, #0f0f1a 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: '"DM Sans", sans-serif', borderRadius: 10 },
          success: { iconTheme: { primary: '#00b894', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e94560', secondary: '#fff' } },
        }} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
