import {
  Box,
  Button,
  IconButton,
  Pagination,
  Typography,
  Radio,
  PaginationItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  useCheckAnswersMutation,
  useGetQuizQuery,
  useSolvedQuizMutation,
} from "../../store/slices/quiz/quizApi";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FlagIcon from "@mui/icons-material/Flag";
import { useTheme } from "@emotion/react";

const SolveQuiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<
    { questionId: string; answersId: string }[]
  >([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const theme = useTheme();
  const [results, setResults] = useState<
    {
      questionId: string;
      answersId: string;
      correctAnswer: string;
      isAnswer: boolean;
    }[]
  >([]);

  const navigate = useNavigate();
  const { id } = useParams<string>();
  const { data, error, isLoading } = useGetQuizQuery(id);
  const [checkAnswers] = useCheckAnswersMutation();
  const [solvedQuiz] = useSolvedQuizMutation();
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    answerId: string
  ) => {
    const updatedAnswer = {
      questionId: questionId,
      answersId: answerId,
    };

    const toggleFlagQuestion = (questionId: string) => {
      setFlaggedQuestions((prevFlaggedQuestions) =>
        prevFlaggedQuestions.includes(questionId)
          ? prevFlaggedQuestions.filter((id) => id !== questionId)
          : [...prevFlaggedQuestions, questionId]
      );
    };

    setSelectedAnswer((prevSelectedAnswers) => {
      const existingIndex = prevSelectedAnswers.findIndex(
        (item) => item.questionId === questionId
      );

      if (existingIndex !== -1) {
        const updatedAnswers = [...prevSelectedAnswers];
        updatedAnswers[existingIndex] = updatedAnswer;
        return updatedAnswers;
      } else {
        return [...prevSelectedAnswers, updatedAnswer];
      }
    });
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prevFlaggedQuestions) => {
      const updatedFlaggedQuestions = prevFlaggedQuestions.includes(questionId)
        ? prevFlaggedQuestions.filter((id) => id !== questionId)
        : [...prevFlaggedQuestions, questionId];

      return updatedFlaggedQuestions;
    });
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentQuestion(value - 1);
  };

  const controlProps = (questionId: string, answerId: string) => ({
    checked: selectedAnswer.some(
      (item) => item.questionId === questionId && item.answersId === answerId
    ),
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChange(event, questionId, answerId),
    value: answerId,
    name: `answer-radio-button-${currentQuestion}`,
    inputProps: { "aria-label": answerId },
  });

  const handleSubmit = async () => {
    try {
      setTimerRunning(false);
      const response = await checkAnswers(selectedAnswer).unwrap();
      setResults(response);
  
      const correctAnswersCount = response.filter(
        (result: any) => result.isAnswer
      ).length;
      const totalQuestions = data?.questions?.length || 1;
      const percentage = Math.round(
        (correctAnswersCount / totalQuestions) * 100
      );
  
      sessionStorage.setItem(
        `quizResults_${id}`,
        JSON.stringify({
          selectedAnswer,
          results: response,
          score: correctAnswersCount,
          totalQuestions,
          percentage,
        })
      );
  
      await solvedQuiz({ quizId: id, score: percentage }).unwrap();
  
      navigate(`/solvequiz/${id}/results`, {
        state: {
          score: correctAnswersCount,
          totalQuestions: totalQuestions,
          percentage: percentage,
          selectedAnswer: selectedAnswer,
          results: response,
        },
      });
    } catch (err) {
      console.error("Failed to check answers:", err);
    }
  };
  

  useEffect(() => {
    if (data) {
      const savedResults = sessionStorage.getItem(`quizResults_${id}`);
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults);
        setSelectedAnswer(parsedResults.selectedAnswer);
        setResults(parsedResults.results);
      }
      
    }
  }, [selectedAnswer, id]);
  useEffect(() => {
      setTimer(data?.duration * 60);
  }, [data?.duration]);

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRunning]);


  useEffect(() => {
      sessionStorage.removeItem(`quizResults_${id}`);
  }, [id]);

  const allQuestionsAnswered = data?.questions.every((question) =>
    selectedAnswer.some((answer) => answer.questionId === question.id)
  );

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading quiz.</Typography>;
  }

  const currentQuestionData = data?.questions[currentQuestion];
  const isLastQuestion = currentQuestion === (data?.questions?.length || 0) - 1;

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-around"}
    >
      <Box
        bgcolor={theme.palette.mode === 'light' ? "white" : theme.palette.secondary.dark}
        position={"absolute"}
        left={"50%"}
        top={"50%"}
        sx={{ transform: "translate(-50%, -50%)", zIndex: "1" }}
        borderRadius={"30px"}
        width={"1200px"}
        height={"550px"}
        p={"30px"}
      >
        <Box fontSize={35} display={"flex"} justifyContent={"space-between"}>
          <Box>
            <IconButton
              aria-label="back"
              onClick={() => navigate("/")}
              sx={{ mr: 1, mb: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            Question
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              {currentQuestion + 1}/{data?.questions?.length}
            </span>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <AccessTimeIcon fontSize="large" />
            <span style={{ color: theme.palette.primary.main, margin: 6 }}>
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>{" "}
            minutes
          </Box>
          <Button
              variant="outlined"
              color="primary"
              onClick={() => toggleFlagQuestion(currentQuestionData.id)}
              sx={{marginRight:5}}
            >
              <FlagIcon />
              {flaggedQuestions.includes(currentQuestionData.id)
                ? "Unflag"
                : "Flag"}
            </Button>
        </Box>
        <Box sx={{ overflowY: "scroll", height: "450px" }}>
          <Box fontSize={40} mt={5}>
            {currentQuestionData?.text ? (
              <Box
                sx={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  width: "98%",
                }}
              >
                {currentQuestionData.text}
              </Box>
            ) : (
              <Box
                component="img"
                src={currentQuestionData?.photo}
                alt={`Question ${currentQuestion + 1}`}
                sx={{ width: "50%", height: "auto" }}
              />
            )}
          </Box>

          <Box mt={5}>
            {currentQuestionData?.Answers.map((answer) => {
              const isCorrectAnswer = results.some(
                (result) =>
                  result.questionId === currentQuestionData.id &&
                  result.correctAnswer === answer.id
              );
              const isSelectedAnswer = selectedAnswer.some(
                (item) =>
                  item.questionId === currentQuestionData.id &&
                  item.answersId === answer.id
              );
              const isPhotoAnswer = Boolean(answer.photo);

              let backgroundColor;

              if (results.length > 0) {
                if (isSelectedAnswer && isCorrectAnswer) {
                  backgroundColor = "rgba(0, 255, 0, 0.5)";
                } else if (isSelectedAnswer && !isCorrectAnswer) {
                  backgroundColor = "rgba(255, 0, 0, 0.5)";
                } else if (isCorrectAnswer && !isSelectedAnswer) {
                  backgroundColor = "rgba(0, 255, 0, 0.5)";
                } else {
                  backgroundColor = "rgba(0, 0, 100, 0.1)";
                }
              } else {
                if (isSelectedAnswer) {
                  backgroundColor =  theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.dark;
                } else {
                  backgroundColor = theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.dark2;
                }
              }

              return (
                <Box
                  pl={5}
                  fontSize={30}
                  mt={5}
                  display={"flex"}
                  alignItems={"center"}
                  key={answer.id}
                  sx={{
                    backgroundColor: backgroundColor,
                    borderRadius: 2,
                    padding: 1,
                    position: "relative",
                  }}
                >
                  <Radio {...controlProps(currentQuestionData.id, answer.id)} />
                  <Box
                    component="span"
                    sx={{
                      color: isCorrectAnswer
                        ? "green"
                        : isSelectedAnswer
                        ? ""
                        : "black",
                      fontWeight: isSelectedAnswer ? "bold" : "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    {answer.text || (
                      <Box
                        component="img"
                        src={answer.photo}
                        alt={`Answer ${answer.id + 1}`}
                        sx={{ width: "30%", height: "auto" }}
                      />
                    )}
                    {isCorrectAnswer && isPhotoAnswer && (
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          color: "green",
                          fontSize: 24,
                        }}
                      >
                        &#10003;
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"} mt={2}>
          <Box flexGrow={1} display={"flex"} justifyContent={"center"}>
            <Pagination
              count={data?.questions?.length}
              page={currentQuestion + 1}
              onChange={handlePaginationChange}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    color: flaggedQuestions.includes(
                      data?.questions[item?.page - 1]?.id
                    )
                      ? "red"
                      : "inherit",
                  }}
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            disabled={!isLastQuestion || !allQuestionsAnswered}
            sx={{
              px: 2,
              py: 1,
              fontSize: "1rem",
              borderRadius: 3,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: isLastQuestion
                  ? theme.palette.primary.dark
                  : undefined,
                boxShadow: isLastQuestion
                  ? "0px 6px 8px rgba(0, 0, 0, 0.15)"
                  : undefined,
              },
            }}
            onClick={handleSubmit}
          >
            Submit quiz
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
            clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
          }}
          bgcolor={theme.palette.mode === "light" ? "secondary.light" : "primary.dark" }
        />
      </Box>
    </Box>
  );
};

export default SolveQuiz;
