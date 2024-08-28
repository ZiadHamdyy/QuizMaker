interface IAnswer {
    id: string;
    text: string | null;
    photo: string | null;
    isCorrect: boolean;
    questionId: string;
  }
  
  interface IQuestion {
    id: string;
    text: string | null;
    photo: string | null;
    correctAnswer: string;
    quizId: string;
    Answers: IAnswer[];
  }
  
  interface IQuiz {
    id: string;
    name: string;
    code: string | null;
    topic: string;
    duration: number | null;
    userId: string;
  }
  interface IQuizAndQuestionAndAnswers {
    id: string;
    name: string;
    code: string | null;
    topic: string;
    duration: number | null;
    userId: string;
    questions: IQuestion[];
  }
  
  export { IQuizAndQuestionAndAnswers, IQuiz, IQuestion, IAnswer };