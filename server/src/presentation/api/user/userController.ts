import { NextFunction, Request, Response } from 'express';
import UserUseCase from '../../../application/UserUsecase';
import jwt from 'jsonwebtoken';
class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user
      const user = await this.userUseCase.getUserById(userFromToken.id);
      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user
      const user = req.body;
      const updatedUser = await this.userUseCase.updateUser(
        userFromToken.id,
        user,
      );
      res.status(200).json(updatedUser);
    } catch (error: any) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFromToken = (req as any).user
      await this.userUseCase.deleteUser(userFromToken.id);
      res.status(204).json();
    } catch (error: any) {
      next(error);
    }
  };
}
export default UserController;
