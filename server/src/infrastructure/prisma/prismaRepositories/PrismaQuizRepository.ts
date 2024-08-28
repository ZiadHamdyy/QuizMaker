import IQuizRepository from '../../../domain/repository/quizRepository';
import prisma from '../PrismaClient';
import {IQuizAndQuestionAndAnswers, IQuestion, IQuiz } from '../../../domain/model/IQuizAndQuestionAndAnswers';
const cloudinary = require('../../../cloudinary/cloudinary');

class PrismaQuizRepository implements IQuizRepository {
  async create(data: any): Promise<any> {
    const quiz = await prisma.quiz.create({ data });
    return quiz;
  }

  async createQuizAndQuestionsAndAnswers(data: any): Promise<IQuizAndQuestionAndAnswers> {
    try {
      const createdQuiz = await prisma.quiz.create({
        data: {
          name: data.name,
          code: data.code,
          topic: data.topic,
          duration: data.duration,
          userId: data.userId,
          questions: {
            create: data.questions.map((question: any) => ({
              text: question.text,
              photo: question.photo,
              Answers: {
                create: question.answers.map((answer: any) => ({
                  text: answer.text,
                  photo: answer.photo,
                  isCorrect: answer.isCorrect,
                })),
              },
              correctAnswer: question.correctAnswer,
            })),
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

      const updatePromises = createdQuiz.questions.map(async (question) => {
        const correctAnswer = question.Answers.find((answer: any) => answer.isCorrect);
        if (correctAnswer) {
          await prisma.question.update({
            where: { id: question.id },
            data: { correctAnswer: correctAnswer.id },
          });
        }
      });

      await Promise.all(updatePromises);

      return createdQuiz;
    } catch (error) {
      console.error('Error in database operation:', error);
      throw new Error('Error creating quiz and questions in database');
    }
  }

  async get(id: string): Promise<IQuizAndQuestionAndAnswers | null> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            Answers: true,
          },
        },
      },
    });

    return quiz;
  }
  async getQuestion(questionId: string): Promise<IQuestion | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        Answers: true,
      },
    });
    return question;
  }

  async getQuizsICreated(userId: string): Promise<IQuizAndQuestionAndAnswers[]> {    
      const quizzes = await prisma.quiz.findMany({
        where: {
          userId: userId,
        },
        include: {
          questions: {
            include: {
              Answers: true,
            },
          },
        },
      });
      
      return quizzes
    }

  async delete(id: string): Promise<IQuiz> {
    await prisma.answer.deleteMany({
      where: {
        question: {
          quizId: id,
        },
      },
    });

    await prisma.question.deleteMany({
      where: {
        quizId: id,
      },
    });

    const quiz = await prisma.quiz.delete({
      where: {
        id: id,
      },
    });    
    return quiz;
  }

  async list(): Promise<IQuizAndQuestionAndAnswers[]> {
    const quiz = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            Answers: true,
          },
        },
      },
    });
    return quiz;
  }
}
export default PrismaQuizRepository;