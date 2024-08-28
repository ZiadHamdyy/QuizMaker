import { apiSlice } from "../../ApiSlice";
import { getAllQuezes, getQuez } from "./quiz";

interface QuizState {
  id: string | null;
  name: string | null;
  code: string | null;
  topic: string | null;
  duration: string | null;
  userId: string | null;
}

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
  name: string;
  code: string | null;
  duration: string;
  topic: string;
  questions: Question[];
}
export const quizSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizes: builder.query<QuizState[], void>({
      query: () => "quiz",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assuming you want to set the first quiz in your state
          if (data.length > 0) {
            dispatch(getAllQuezes(data[0])); // Or handle setting multiple quizzes as needed
          }
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      },
    }),
    getMyQuizes: builder.query<QuizState[], void>({
      query: () => "quiz/userQuizs",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assuming you want to set the first quiz in your state
          if (data.length > 0) {
            dispatch(getAllQuezes(data[0])); // Or handle setting multiple quizzes as needed
          }
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      },
    }),
    deleteMyQuizes: builder.mutation({
      query: (id) => ({
        url: `quiz/${id}`,
        method: 'DELETE',
      }),
    }),
    getSolvedQuizes: builder.query<QuizState[], void>({
      query: () => "solved",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assuming you want to set the first quiz in your state
          if (data.length > 0) {
            dispatch(getAllQuezes(data[0])); // Or handle setting multiple quizzes as needed
          }
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      },
    }),
    getQuiz: builder.query<Quiz, void>({
      query: (id) => `quiz/${id}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assuming you want to set the first quiz in your state
            dispatch(getQuez(data));

        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      },
    }),
    createQuize: builder.mutation({
      query: (quiz: Quiz) => ({
        url: "quiz",
        method: "POST",
        body: quiz,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error('failed to send the quiz', error);
        }
      },
    }),
    checkAnswers: builder.mutation({
      query: (solvedQuestions) => ({
        url: 'quiz/checkanswers',
        method: 'POST',
        body: solvedQuestions,
      }),
    }),
    solvedQuiz: builder.mutation({
      query: (solvedQuiz) => ({
        url: 'solved/',
        method: 'POST',
        body: solvedQuiz,
      }),
    }),
    solvedPercentage: builder.query({
      query: () => ({
        url: 'solved/solvedpercentage',
        method: 'GET',
      }),
    }),
  }),
});
export const { useGetQuizesQuery, useGetMyQuizesQuery, useDeleteMyQuizesMutation, useGetSolvedQuizesQuery, useGetQuizQuery, useCreateQuizeMutation, useCheckAnswersMutation, useSolvedQuizMutation, useSolvedPercentageQuery} = quizSlice;

export default quizSlice.reducer;
