import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useColorMode } from './colorMode';

export default function ToggleColorMode() {
  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <IconButton
      onClick={colorMode.toggleColorMode}
      color="inherit"
      sx={{ ml: 2 }}
    >
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
