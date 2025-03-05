// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Lade Präferenz aus localStorage, falls vorhanden
    const savedMode = localStorage.getItem('darkMode');
    // Wenn keine Präferenz gespeichert ist, prüfe auf Systemeinstellung
    if (savedMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return JSON.parse(savedMode);
  });

  // Erstelle ein MUI-Theme basierend auf dem Dark Mode Status
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode ? {
        primary: {
          main: '#90caf9',
        },
        background: {
          default: '#434343FF',
          paper: '#434343FF',
        },
      } : {
        primary: {
          main: '#1976d2',
        },
      }),
    },
  });

  useEffect(() => {
    // Speichere Präferenz im localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};