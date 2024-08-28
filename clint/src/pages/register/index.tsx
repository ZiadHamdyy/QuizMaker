import { Box, Button, Link, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import InputFileUpload from "./UploadFile";
import CommonlyUsedComponents from "./DateOBPicker";
import React from 'react';
import { useRegisterUserMutation } from "../../store/slices/auth/authApi";
import { setCredentials } from "../../store/slices/auth/auth";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useTheme } from "@emotion/react";
const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [registerUser] = useRegisterUserMutation()
  const theme = useTheme();
  
  const [userRegister, setUserRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: ""
  })
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleRegister = async () => {
    try {
      if (userRegister.password !== userRegister.confirmPassword) {
        enqueueSnackbar('password and confirm password is not equal.', { variant: 'error' });
      }else{
        const { confirmPassword, ...registerData } = userRegister;
        const response = await registerUser(registerData).unwrap();
        const { accessToken } = response;
        if (accessToken) {
          dispatch(setCredentials({ accessToken }));
          enqueueSnackbar('Register successful!', { variant: 'success' });
        } else {
          throw new Error('Access token not found in response');
        }
      }
    } catch (err) {
      enqueueSnackbar(err?.data?.message || err?.data || 'Register failed', { variant: 'error' });
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
        width={"1000px"}
        height={"530px"}
        p={"30px"}
        display={"flex"}
      >
        <Box /* bgcolor={"red"} */ width={"50%"} height={"100%"}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box width={"50%"} height={"25%"}>
              <Box pb={"20px"} fontSize={19}>
                Welcome to Quiz app
              </Box>
              <Box fontSize={50}>
                Sign<span style={{ color: theme.palette.primary.main }}>up</span>
              </Box>
            </Box>
            <Box width={"37%"} height={"25%"}>
              <Box fontSize={20}>Have an Acount ?</Box>
              <Link href="/login" underline="hover">
                Log in
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
                label="Enter user name"
                variant="standard"
                fullWidth
                onChange={(e) => setUserRegister({...userRegister, name: e.target.value})}
              />
            </Box>
            <Box width={"91%"}>
              <TextField
                id="standard-basic"
                label="Enter email"
                variant="standard"
                fullWidth
                onChange={(e) => setUserRegister({...userRegister, email: e.target.value})}
              />
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <Box display={"flex"}>
                <Box width={"45%"} mr={1}>
                  <TextField
                    id="standard-password-input"
                    label="Enter password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setUserRegister({...userRegister, password: e.target.value})}
                  />
                </Box>
                <Box width={"45%"}>
                  <TextField
                    id="standard-password-input"
                    label="Confirm password"
                    type="password"
                    autoComplete="current-password"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setUserRegister({...userRegister, confirmPassword: e.target.value})}
                  />
                </Box>
              </Box>
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
              <CommonlyUsedComponents userRegister={userRegister} setUserRegister={setUserRegister}/>
          </Box>
        </Box>
        <Box
          width={"50%"}
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-around"}
        >
          <InputFileUpload userRegister={userRegister} setUserRegister={setUserRegister}/>
          <Button
            variant="contained"
            fullWidth
            sx={{ textTransform: "none" }}
            onClick={handleRegister}
          >
            Sign up
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

export default Register;
