import { NextFunction, Request, Response } from 'express';
import QuizUseCase from '../../../application/QuizUsecase';


class QuizController {
  constructor(
    private readonly quizUseCase: QuizUseCase,
  ) {}

  createQuizAndQuestionsAndAnswers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quiz = req.body;
      const userFromToken = (req as any).user;
      const newQuizAndQuestionsAndAnswers = await this.quizUseCase.createQuizAndQuestionsAndAnswers(quiz, userFromToken.id)      
      res.status(201).json({newQuizAndQuestionsAndAnswers});
    } catch (error: any) {
      next(error);
    }
  };

  getQuizById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const quiz = await this.quizUseCase.getQuizById(id);
      res.status(200).json(quiz);
    } catch (error: any) {
      next(error);
    }
  };

  deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userFromToken = (req as any).user;
      await this.quizUseCase.deleteQuiz(id, userFromToken.id);
      res.status(204).json();
    } catch (error: any) {
      next(error);
    }
  };
  getQuizs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizs = await this.quizUseCase.getQuizs();
      res.status(200).json(quizs);
    } catch (error: any) {
      next(error);
    }
  };
  getQuizsICreated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user;
      const quizs = await this.quizUseCase.getQuizsICreated(userFromToken.id);
      res.status(200).json(quizs);
    } catch (error: any) {
      next(error);
    }
  };
  checkAnswers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const solvedQuestions = req.body
      const quizs = await this.quizUseCase.checkAnswers(solvedQuestions);
      res.status(200).json(quizs);
    } catch (error: any) {
      next(error);
    }
  };
}
export default QuizController;
