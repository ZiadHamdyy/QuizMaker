import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTheme } from "@emotion/react";
const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const { score, totalQuestions, percentage } = location.state;
  const theme = useTheme();
  const handleReviewQuestions = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      bgcolor={
        theme.palette.mode === "light" ? "white" : theme.palette.secondary.dark
      }
      p={5}
    >
      <Typography variant="h4" gutterBottom>
        Quiz Results
      </Typography>
      <Typography variant="h5">
        You scored {score} out of {totalQuestions}
      </Typography>
      <Box width={100} mt={5}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={{
            path: {
              stroke: theme.palette.divider,
            },
            text: {
              fill: theme.palette.divider,
              fontSize: "16px",
            },
            trail: {
              stroke: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Box mt={4} display={"flex"} gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReviewQuestions}
          startIcon={<ArrowBackIcon />}
        >
          Review Questions
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default QuizResults;
