import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import CreateQuiz3 from "./pages/createQuiz3";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import Cookies from 'js-cookie';
import { useEffect, useState, useMemo} from "react";
import React from 'react';
import SolveQuiz from "./pages/solveQuiz";
import QuizResults from "./pages/solveQuiz/quizResult";
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext } from "./component/colorMode";



function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('themeMode') === 'dark' ? 'dark' : 'light'
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ffc288',
          },
          secondary: {
            main: '#ffebcd',
            dark: '#1c1c1c',
            dark1: '#393737',
            dark2: '#545353',
          },
          divider: '#4b8077',
        },
        typography: {
          fontFamily: 'Rubik',
        },
      }),
    [mode]
  );

  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('Logged_in') === 'true');

  useEffect(() => {
    const handleCookieChange = () => {
      setIsLoggedIn(Cookies.get('Logged_in') === 'true');
    };

    const intervalId = setInterval(handleCookieChange, 0);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={2}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
              <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
              <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
              <Route path="/createquiz3" element={isLoggedIn ? <CreateQuiz3 /> : <Navigate to="/login" />} />
              <Route path="/solvequiz/:id" element={isLoggedIn ? <SolveQuiz /> : <Navigate to="/login" />} />
              <Route path="/solvequiz/:id/results" element={isLoggedIn ? <QuizResults /> : <Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
