import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import PrimarySearchAppBar from "./Search";
import LeftBar from "./leftBar";
import React from 'react';

import AllQuizesTable from "./QuizTable";
import MyQuizesTable from "./MyQuizesTable";
import SolvedQuizesTable from "./SolvedQuizesTable";
import { useTheme } from "@emotion/react";

const Home = () => {
  const [isTopBar, setIsTopBar] = useState(false);
  const [openLeftBar, setOpenLeftBar] = useState(false);
  const [table, setTable] = useState("all");
  const theme = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTopBar(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: isTopBar ? "fixed" : "relative",
        top: isTopBar ? 0 : "auto",
        left: 0,
        width: "100%",
        height: isTopBar ? "60px" : "100vh",
        transition: "all 1s ease",
        zIndex: -1,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: -1,
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
            ...(isTopBar && {
              clipPath: "none",
              zIndex: -1,
            }),
          }}
          bgcolor="primary"
        />
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems={"center"}
          borderRadius={4}
          height={"60px"}
        >
          <PrimarySearchAppBar/>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
            bgcolor: "#E5E5E5",
            transition: "all 1s ease",
            zIndex: -1,
            ...(isTopBar && {
              clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)",
            }),
          }}
          bgcolor={theme.palette.mode === "light" ? "secondary.light": "secondary.dark"}
        />
      </Box>
      <Box display={"flex"} height={"100vh"} bgcolor={theme.palette.mode === "light" ? "secondary.light": "secondary.dark"} borderTop={1} borderColor={theme.palette.mode === "light" ? "secondary.dark" : "secondary.light"} padding={2}>
      <LeftBar setTable={setTable}/>

      {table === "all" && <AllQuizesTable/>}
      {table === "my" && <MyQuizesTable/>}
      {table === "solved" && <SolvedQuizesTable/>}
      {/* <QuizesList/> */}
      </Box>
    </Box>
  );
};

export default Home;
