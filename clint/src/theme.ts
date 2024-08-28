// theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
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
  });
};
