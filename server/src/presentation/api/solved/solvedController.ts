import { NextFunction, Request, Response } from 'express';
import SolvedUseCase from '../../../application/SolvedUsecase';

class SolvedController {
  constructor(private readonly solvedUseCase: SolvedUseCase) {}

  createSolved = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const solved = req.body;
      
      const newSolved = await this.solvedUseCase.createSolved(solved, (req as any).user);
      res.status(201).json(newSolved);
    } catch (error: any) {
      next(error);
    }
  };
  getSolvedQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user;
      const SolvedQuizs = await this.solvedUseCase.getSolvedQuiz(userFromToken.id);
      res.status(201).json(SolvedQuizs);
    } catch (error: any) {
      next(error);
    }
  };
  calculateSolvedQuizPercentage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user;
      const percentage = await this.solvedUseCase.calculateSolvedQuizPercentage(userFromToken.id);
      res.status(201).json(percentage);
    } catch (error: any) {
      next(error);
    }
  };

  deleteSolved = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.solvedUseCase.deleteSolved(id, (req as any).user);
      res.status(204).json();
    } catch (error: any) {
      next(error);
    }
  };

  getSolveds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const solveds = await this.solvedUseCase.getSolveds();
      res.status(200).json(solveds);
    } catch (error: any) {
      next(error);
    }
  };
}
export default SolvedController;

