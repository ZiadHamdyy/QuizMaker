import UserUseCase from '../../../application/UserUsecase';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import APIError from '../../../application/Errors/APIError';

class UserAuthentication {
  constructor(private readonly userUseCase: UserUseCase) {}

  private generateTokens(id: string) {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
  
  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 5 * 60 * 1000 }); // 5 min
    res.cookie('Logged_in', true, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;
      
      const newUser = await this.userUseCase.createUser(user);
      const { accessToken, refreshToken } = this.generateTokens(newUser.id);
    this.setTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ user: newUser, accessToken });
    } catch (error: any) {
      next(error);
    }
  };
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        const newUser = await this.userUseCase.loginUser(user);
        const { accessToken, refreshToken } = this.generateTokens(newUser.id);
        this.setTokenCookies(res, accessToken, refreshToken);
        res.status(200).json({ newUser, accessToken });
      } catch (error: any) {
        next(error);
      }
  };
  generateNewAccessToken = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies
      const { accessToken, refreshToken } = await this.userUseCase.generateNewAccessToken(cookies);
      this.setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({accessToken});
    } catch (error: any) {
      next(error);
    }
  }
  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies

      if(!cookies?.refreshToken) throw new APIError('No content', 204);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('Logged_in');
      
      console.log('Logged out successfully');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      next(error);
    }
  };
}

export default UserAuthentication;
