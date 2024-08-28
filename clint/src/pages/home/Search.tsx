import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import { useGetUserByIdQuery } from '../../store/slices/user/userApi';
import { Avatar } from '@mui/material';
import { useSendLogOutMutation } from '../../store/slices/auth/authApi';
import { useSnackbar } from 'notistack';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTheme } from '@emotion/react';
import ToggleColorMode from '../../component/ToggleColorMode';


export default function PrimarySearchAppBar() {

  const { enqueueSnackbar } = useSnackbar();
  const [sendLogOut] = useSendLogOutMutation();
  const user = useGetUserByIdQuery()
  const theme = useTheme()
  const onLogOutClick = async () => {
    try {
      const result = await sendLogOut().unwrap();
      enqueueSnackbar("Logged out successfully", { variant: "success" });
    } catch (error) {
      console.error("Logout failed:", error);
      enqueueSnackbar("Logout failed. Please try again.", { variant: "error" });
    }
  };
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx={{
          backgroundColor: theme.palette.mode === 'light' ? "primary.main" : "black", // Set the AppBar background color
        }}>
        <Toolbar>
          <QuizIcon fontSize='large' sx={{marginRight:1}}/>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ display: { x: 'none', md: 'block', flexGrow: 0.5}}}
          >
              QuizMaker
          </Typography>
          <Box sx={{ flexGrow: 3}}/>
          <ToggleColorMode style={{ display: 'none' }} />

          <IconButton aria-label="Log out" onClick={onLogOutClick} sx={{marginRight:2}}>
          <LogoutIcon fontSize='large'/>
          </IconButton>
          <Avatar
          alt="User"
          sx={{
            width: "40px",
            height: "40px",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          src={user?.data?.photo || ""}
        />
          <Typography variant="h6" color={theme.palette.mode === "light" ? "black" : "white"} mx={1}>{user?.data?.name}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
