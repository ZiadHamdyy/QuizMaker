import { createSlice } from "@reduxjs/toolkit";

interface QuizState {
    id: string | null,
    name: string | null,
    code: string | null,
    topic: string | null,
    duration: string | null,
    userId: string | null,
  }
  
  const initialState: QuizState = {
    id: null,
    name: null,
    code: null,
    topic: null,
    duration: null,
    userId: null,
  };

  interface Answer {
    text: string;
    image?: string;
  }
  
  interface Question {
    type: "Text" | "Photo";
    questionText?: string;
    questionImage?: string;
    answers: Answer[];
    correctAnswer?: number;
  }
  interface Quiz {
    id: string;
    name: string;
    code: string | null;
    duration: string;
    topic: string;
    userId: string;
    questions: Question[];
  }

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        getAllQuezes: (state, action) => {
            const quiz = action.payload as Quiz;
            state.id = quiz.id;
            state.name = quiz.name;
            state.code = quiz.code;
            state.topic = quiz.topic;
            state.duration = quiz.duration;
            state.userId = quiz.userId;
            state.questions = quiz.questions as Question[];
        },
        getQuez: (state, action) => {
            const quiz = action.payload as Quiz;
            state.id = quiz.id;
            state.name = quiz.name;
            state.code = quiz.code;
            state.topic = quiz.topic;
            state.duration = quiz.duration;
            state.userId = quiz.userId;
            state.questions = quiz.questions as Question[];
        },
    }
});
export const { getAllQuezes, getQuez } = quizSlice.actions;
export default quizSlice.reducer;
export const selectCurrentId = (state: any) => state.quiz?.id;
export const selectCurrentName = (state: any) => state.quiz?.name;
