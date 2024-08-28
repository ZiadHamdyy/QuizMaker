import ISolvedRepository from '../../../domain/repository/solvedRepository';
import ISolved from '../../../domain/model/ISolved';
import prisma from '../PrismaClient';
import { IQuiz, IQuizAndQuestionAndAnswers } from '../../../domain/model/IQuizAndQuestionAndAnswers';

class PrismaSolvedRepository implements ISolvedRepository {
  async create(data: any): Promise<any> {
    const solved = await prisma.solved.create({ data });
    return solved;
  }

  async get(id: string): Promise<ISolved | null> {
    const solved = await prisma.solved.findUnique({ where: { id } });
    return solved;
  }

  async getSolvedQuiz(userId: string): Promise<IQuizAndQuestionAndAnswers[] | null> {
    const solvedQuizzes = await prisma.solved.findMany({
      where: {
        userId: userId,
      },
      select: {
        quizId: true,
      },
    });
    const quizIds = solvedQuizzes.map(solved => solved.quizId);

    const quizzes = await prisma.quiz.findMany({
      where: {
        id: {
          in: quizIds,
        },
      },
      include: {
        questions: {
          include: {
            Answers: true,
          },
        },
      },
    });

    return quizzes;
  }
  async getScoreByQuizId(quizId: string): Promise<number | null> {
    const solved = await prisma.solved.findUnique({
      where: { quizId },
      select: { score: true },
    });
  
    if (!solved) {
      return null;
    }
  
    return solved.score;
  }
  async calculateSolvedQuizPercentage(userId: string): Promise<number> {
    const totalQuizzes = await prisma.quiz.count();

    if (totalQuizzes === 0) {
      return 0;
    }

    const solvedQuizzes = await this.getSolvedQuiz(userId);
    const solvedQuizzesCount = solvedQuizzes ? solvedQuizzes.length : 0;

    const percentage = (solvedQuizzesCount / totalQuizzes) * 100;

    return percentage;
  }
  
  async getquiz(quizId: string): Promise<ISolved | null> {
    const solved = await prisma.solved.findUnique({ where: { quizId } });
    return solved;
  }

  async update(id: string, data: any): Promise<ISolved> {
    const solved = await prisma.solved.update({ where: { id }, data });
    return solved;
  }

  async delete(id: string): Promise<ISolved> {
    const solved = await prisma.solved.delete({ where: { id } });
    return solved;
  }

  async list(): Promise<ISolved[]> {
    const solved = await prisma.solved.findMany();
    return solved;
  }
}

export default PrismaSolvedRepository;
