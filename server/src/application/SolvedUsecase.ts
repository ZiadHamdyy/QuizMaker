import { IQuizAndQuestionAndAnswers } from '../domain/model/IQuizAndQuestionAndAnswers';
import ISolved from '../domain/model/ISolved';
import SolvedRepository from '../domain/repository/solvedRepository';
import UserRepository from '../domain/repository/userRepository';
import APIError from './Errors/APIError';

class SolvedUseCase {
  constructor(private readonly solvedRepository: SolvedRepository, private readonly userRepository: UserRepository) {}

  async createSolved(solved: ISolved, user:any): Promise<ISolved> {
    const isSolved = await this.solvedRepository.getquiz(solved.quizId);
    
    if(!isSolved) {
      const solvedData = {...solved, userId:user.id}
      
      const newSolved = await this.solvedRepository.create(solvedData);
      
      if (!newSolved) throw new APIError('solved not created', 500);
  
      return newSolved;
    }

    if(isSolved && isSolved.score < solved.score) {
        const updateQuizScore = await this.solvedRepository.update(isSolved.id, solved);
        return updateQuizScore
    }else{
      return isSolved
    }

  }
  async getSolvedQuiz(userId: string): Promise<(IQuizAndQuestionAndAnswers & { score?: number })[]> {
    const solvedQuizzes = await this.solvedRepository.getSolvedQuiz(userId);
  
    if (!solvedQuizzes) throw new APIError('No solved quizzes found', 500);
    const quizzesWithScores: (IQuizAndQuestionAndAnswers & { score?: number })[] = [];
  
    for (const quiz of solvedQuizzes) {
      const score = await this.solvedRepository.getScoreByQuizId(quiz.id);

      quizzesWithScores.push({
        ...quiz,
        score,
      });
    }
  
    return quizzesWithScores;
  }
  
  async calculateSolvedQuizPercentage(userId: string): Promise<IQuizAndQuestionAndAnswers[]> {
    const percentage = await this.solvedRepository.calculateSolvedQuizPercentage(userId);
    
    if (!percentage === null) throw new APIError('solved found', 500);

    return percentage;
  }

  async deleteSolved(solvedId: string, isAdmin:any): Promise<void> {
    const admin = await this.userRepository.get(isAdmin.id);
    if(!admin.isAdmin) throw new APIError('You are not Authorized to delete solved.', 403);

    const solvedExists = await this.solvedRepository.get(solvedId);
    if (!solvedExists) throw new APIError('Solved not found', 404);
    return this.solvedRepository.delete(solvedId);
  }

  async getSolveds(): Promise<ISolved[]> {
    return this.solvedRepository.list();
  }
}

export default SolvedUseCase;
