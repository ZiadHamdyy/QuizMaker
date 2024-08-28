import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Typography,
  Radio,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddButton from "./AddButton";
import { useNavigate } from "react-router-dom";
import SelectTopic from "./selectCatigory";
import SelectDuration from "./selectDuration";
import AddQuestion from "./AddQuestion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCreateQuizeMutation } from "../../store/slices/quiz/quizApi";
import { useSnackbar } from "notistack";
import { useTheme } from "@emotion/react";
interface Answer {
  type: "Text" | "Photo" | undefined;
  text: string | null;
  photo: string | null;
  isCorrect: boolean;
}

interface Question {
  type: "Text" | "Photo" | undefined;
  text: string | null;
  photo: string | null;
  answers: Answer[];
  correctAnswer?: number | string;
}
interface Quiz {
  name: string;
  code: string;
  duration: string;
  topic: string;
  questions: Question[];
}
const CreateQuiz3 = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ createQuiz, {data, isLoading, isSuccess} ] = useCreateQuizeMutation()
  const theme = useTheme();
  const [quiz, setQuiz] = useState<Quiz>({
    name:"",
    code: "",
    topic: "",
    duration: "",
    questions,
  });
  const handleCreateQuiz = async () => {
    try {
      questions.forEach((question) => {
        if (question.correctAnswer !== undefined) {
          const correctIndex = Number(question.correctAnswer);
  
          question.answers.forEach((answer, index) => {
            if (answer.text) {
              answer.photo = null;
            } else if (answer.photo) {
              answer.text = null;
            }
            answer.isCorrect = index === correctIndex;
            answer.type = undefined;
          });
  
          question.correctAnswer = "";
        }
        if (question.text) {
          question.photo = null;
        } else if (question.photo) {
          question.text = null;
        }
        question.type = undefined;
      });
  
      quiz.questions = questions;
      const result = await createQuiz(quiz).unwrap();
    if (result) {
      enqueueSnackbar('Quiz created successfully!', { variant: 'success' });
      navigate("/")
    }
    } catch (err) {
      enqueueSnackbar(err?.data?.message || err?.data || 'failed to create a quiz', { variant: 'error' });
    }
  };
  const [addQuestionPage, setAddQuestionPage] = useState<{
    bool: boolean;
    type: "Text" | "Photo";
    editIndex?: number;
  }>({
    bool: false,
    type: "Text",
  });

  const handleSetAddQuestionPage = (type: "Text" | "Photo", editIndex?: number) => {
    setAddQuestionPage({
      bool: true,
      type,
      editIndex,
    });
  };

  const handleSaveQuestion = (newQuestion: Question) => {
    if (addQuestionPage.editIndex !== undefined) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, index) =>
          index === addQuestionPage.editIndex ? newQuestion : q
        )
      );
    } else {
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    }
    setAddQuestionPage({ bool: false, type: "Text" });
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
  };

  if (addQuestionPage.bool) {
    return (
      <AddQuestion
        questionType={addQuestionPage.type}
        onSaveQuestion={handleSaveQuestion}
        onCancel={() => setAddQuestionPage({ bool: false, type: "Text" })}
        editQuestion={
          addQuestionPage.editIndex !== undefined
            ? questions[addQuestionPage.editIndex]
            : undefined
        }
      />
    );
  }

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
        minHeight={"400px"}
        height={"auto"}
        maxHeight={"600px"}
        p={"30px"}
      >
        <Box display={"flex"}>
          <Box
            width={"50%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-evenly"}
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box fontSize={50} color={theme.palette.mode === 'light' ? "black" : "white"}>
                <IconButton
                  aria-label="back"
                  onClick={() => navigate("/")}
                  sx={{ mr: 1, mb: 1 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Create
                <span style={{ color: theme.palette.primary.main}}> Quiz</span>
              </Box>
            </Box>
            <Box
              width={"91%"}
              display={"flex"}
              flexDirection={"column"}
              gap={3}
              mt={5}
            >
              <TextField
                id="standard-basic"
                label="Quiz Title"
                variant="standard"
                fullWidth
                onChange={(e) => setQuiz({...quiz, name: e.target.value})}
              />
              <TextField
                id="standard-basic"
                label="Code (optional)"
                variant="standard"
                fullWidth
                onChange={(e) => setQuiz({...quiz, code: e.target.value})}
              />
              <Box display={"flex"} justifyContent={"space-around"}>
              <SelectDuration quiz={quiz} setQuiz={setQuiz}/>
              <SelectTopic quiz={quiz} setQuiz={setQuiz}/>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none", mt: 2 }}
                onClick={handleCreateQuiz}
              >
                {isLoading ? "Creating ...":"Create quiz"}
              </Button>
            </Box>
          </Box>
          <Box width={"50%"}>
            <Box
              fontSize={30}
              display={"flex"}
              justifyContent={"space-around"}
              alignItems={"center"}
              pb={2}
            >
              Questions
              <AddButton setaddQuestionPage={handleSetAddQuestionPage} />
            </Box>
            {questions.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                mt={5}
              >
                No questions added yet. Click "Add" to create a new question.
              </Typography>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{ overflowY: "scroll", maxHeight: "450px" }}
              >
                {questions.map((question, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      padding={2}
                      display={"flex"}
                      flexDirection={"column"}
                      borderRadius={2}
                      border={2}
                      borderColor={"primary.main"}
                      mr={1}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Box fontWeight="bold" mb={1}>
                          Question {index + 1}
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() =>
                              handleSetAddQuestionPage(question.type, index)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteQuestion(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      {question.type === "Text" ? (
                        <Typography>{question.text}</Typography>
                      ) : (
                        <Box
                          component="img"
                          src={question.photo}
                          alt={`Question ${index + 1}`}
                          sx={{ width: "100%", height: "auto" }}
                        />
                      )}
                      <Box mt={2}>
                        <Typography fontWeight="bold">Answers:</Typography>
                        {question.answers.map((answer, idx) => (
                          <Box
                            key={idx}
                            display="flex"
                            alignItems="center"
                            mt={1}
                          >
                            <Radio
                              checked={question.correctAnswer === idx}
                              disabled
                              color="success"
                            />
                            {answer.photo ? (
                              <Box
                                component="img"
                                src={answer.photo}
                                alt={`Answer ${idx + 1}`}
                                sx={{ width: "50%", height: "auto" }}
                              />
                            ) : (
                              <Typography>{answer.text}</Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
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
      { isLoading && <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      display={"flex"} flexDirection={"column"}>
      <CircularProgress size={60} style={{ color: theme.palette.divider}}/>
      <Box fontSize={20} mt={2}>
      <span style={{ color: theme.palette.divider }}>This might take a several minute</span>
      </Box>
      </Box>}
    </Box>
  );
};

export default CreateQuiz3;