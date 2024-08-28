import {
  Box,
  Button,
  TextField,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InputFileUpload from "../../component/uploadPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";

interface Answer {
  text: string;
  photo?: string; // Optional photo field
  type: "Text" | "Photo";
}

interface Question {
  type: "Text" | "Photo";
  text?: string;
  photo?: string;
  answers: Answer[];
  correctAnswer?: number; // Index of the correct answer
}

interface AddQuestionProps {
  questionType: "Text" | "Photo";
  onSaveQuestion: (question: Question) => void;
  onCancel: () => void;
  editQuestion?: Question;
}

const AddQuestion: React.FC<AddQuestionProps> = ({
  questionType,
  onSaveQuestion,
  onCancel,
  editQuestion,
}) => {
  const [text, setText] = useState(editQuestion?.text || "");
  const [photo, setPhoto] = useState<string>(editQuestion?.photo || "");
  const [answers, setAnswers] = useState<Answer[]>(editQuestion?.answers || []);
  const [selectedValue, setSelectedValue] = useState<number | string>(editQuestion?.correctAnswer || "");
  const theme = useTheme();
  useEffect(() => {
    if (editQuestion) {
      setText(editQuestion.text || "");
      setPhoto(editQuestion.photo || "");
      setAnswers(editQuestion.answers || []);
      setSelectedValue(editQuestion.correctAnswer || "");
    }
  }, [editQuestion]);

  const handleAnswerChange = (index: number, newValue: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, text: newValue } : answer
      )
    );
  };

  const handleImageChange = (
    photo: string,
    context: "question" | "answer",
    index?: number
  ) => {
    if (context === "question") {
      setPhoto(photo);
    } else if (context === "answer" && index !== undefined) {
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer, i) =>
          i === index ? { ...answer, photo } : answer
        )
      );
    }
  };

  const addAnswer = (type: "Text" | "Photo") => {
    setAnswers((prev) => [
      ...prev,
      { type, text: "", photo: "", isCorrect: false },
    ]);
  };

  const handleSaveQuestion = () => {
    const newQuestion: Question = {
      type: questionType,
      text: questionType === "Text" ? text : undefined,
      photo: questionType === "Photo" ? photo : undefined,
      answers,
      correctAnswer: Number(selectedValue) - 1,
    };
  
    if ((questionType === "Text" && text.trim()) || (questionType === "Photo" && photo)) {
      if (answers.length >= 2 && selectedValue !== "") {
        onSaveQuestion(newQuestion);
      } else {
        alert("Please complete all fields and select at least one correct answer.");
      }
    } else {
      alert("Please complete all fields and select at least one correct answer.");
    }
  };
  

  return (
    <Box display={"flex"}>
      <Box
        bgcolor={theme.palette.mode === 'light' ? "white" : theme.palette.secondary.dark}
        position={"absolute"}
        left={"50%"}
        top={"50%"}
        sx={{ transform: "translate(-50%, -50%)", zIndex: "1", overflowY: "scroll" }}
        borderRadius={"30px"}
        width={"1000px"}
        height={"auto"}
        maxHeight={"500px"}
        p={"30px"}
      >
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Box fontSize={50}>
            Create
            <span style={{ color: theme.palette.primary.main }}> Question</span>
          </Box>
          <Box>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "15px", mr: 2 }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: "15px" }}
              onClick={handleSaveQuestion}
            >
              Save Question
            </Button>
          </Box>
        </Box>
        <Box mt={3}>
          {questionType === "Text" ? (
            <TextField
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <InputFileUpload
              onImageChange={(photo) => handleImageChange(photo, "question")}
              context="question"
            />
          )}
        </Box>
        <Box mt={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box fontSize={30}>Answers</Box>
            <Box>
              <Button
                variant="contained"
                sx={{ textTransform: "none", mr: 2 }}
                onClick={() => addAnswer("Text")}
              >
                Add Text Answer
              </Button>
              <Button
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => addAnswer("Photo")}
              >
                Add Photo Answer
              </Button>
            </Box>
          </Box>
          <Box mt={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Correct Answer</FormLabel>
              <RadioGroup
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                {answers.map((answer, index) => (
                  <Box
                    key={index}
                    mt={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <FormControlLabel
                      value={(index + 1).toString()}
                      control={<Radio />}
                      label={
                        answer.type === "Text" ? (
                          <TextField
                            variant="outlined"
                            fullWidth
                            value={answer.text}
                            onChange={(e) =>
                              handleAnswerChange(index, e.target.value)
                            }
                          />
                        ) : (
                          <InputFileUpload
                            context="answer"
                            index={index}
                            onImageChange={(photo) => handleImageChange(photo, "answer", index)}
                          />
                        )
                      }
                    />
                    <IconButton
                      onClick={() => {
                        setAnswers((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        if (Number(selectedValue) === index + 1) {
                          setSelectedValue("");
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
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
    </Box>
  );
};

export default AddQuestion;