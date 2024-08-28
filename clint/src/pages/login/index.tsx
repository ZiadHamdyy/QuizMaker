import { Box, Button, Link, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useSnackbar  } from 'notistack';
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/auth/auth";
import { useLoginUserMutation } from "../../store/slices/auth/authApi";
import React, { useState } from 'react';
import { useTheme } from "@emotion/react";
const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const theme = useTheme();
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [ loginUser ] = useLoginUserMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignIn = async () => {
    try {
      const response = await loginUser(loginForm).unwrap();
      const { accessToken } = response;
      if (accessToken) {
        dispatch(setCredentials({ accessToken }));
        enqueueSnackbar('Login successful!', { variant: 'success' });
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (err) {
      enqueueSnackbar(err?.data?.message || err?.data || 'Login failed', { variant: 'error' });
    }
  };

  return (
    <Box display={"flex"}>
      <Box
        bgcolor={theme.palette.mode === 'light' ? "white" : theme.palette.secondary.dark}
        position={"absolute"}
        left={"50%"}
        top={"50%"}
        sx={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
        borderRadius={"30px"}
        width={"450px"}
        height={"530px"}
        p={"30px"}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box width={"50%"} height={"25%"}>
            <Box pb={"20px"} fontSize={19}>
              Welcome to Quiz app
            </Box> 
            <Box fontSize={50}>Sign<span style={{ color: theme.palette.primary.main }}>in</span></Box>
          </Box>
          <Box width={"37%"} height={"25%"}>
            <Box fontSize={20}>No Account?</Box>
            <Link href="/register" underline="hover">
              Sign up
            </Link>
          </Box>
        </Box>
        <Box
          width={"100%"}
          height={"75%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-evenly"}
        >
          <Box width={"91%"}>
            <TextField
              id="standard-basic"
              label="Enter email"
              variant="standard"
              fullWidth
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <TextField
              id="standard-password-input"
              label="Enter password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              variant="standard"
              fullWidth
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
            <Box pt={2} px={1}>
              {isPasswordVisible ? (
                <VisibilityOffIcon
                  onClick={() => setIsPasswordVisible(false)}
                />
              ) : (
                <VisibilityIcon onClick={() => setIsPasswordVisible(true)} />
              )}
            </Box>
          </Box>
          <Box display={"flex"} justifyContent={"end"}>
          </Box>
          <Button variant="contained" fullWidth sx={{ textTransform: "none" }} onClick={handleSignIn}>
          Sign in
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
          bgcolor={theme.palette.mode === "light" ? "primary.main" : "secondary.dark2" }
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
          }}
          bgcolor={theme.palette.mode === "light" ? "secondary.light" : "primary.dark" }
        />
      </Box>
    </Box>
  );
};

export default Login;
