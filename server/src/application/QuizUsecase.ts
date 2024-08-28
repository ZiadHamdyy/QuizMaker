import {IQuizAndQuestionAndAnswers, IAnswer, IQuestion} from '../domain/model/IQuizAndQuestionAndAnswers';
import QuizRepository from '../domain/repository/quizRepository';
import UserRepository from '../domain/repository/userRepository';
import APIError from './Errors/APIError';
const cloudinary = require('../cloudinary/cloudinary');

class QuizUseCase {
  constructor(private readonly quizRepository: QuizRepository, private readonly userRepository: UserRepository) {}

    async createQuizAndQuestionsAndAnswers(quiz: IQuizAndQuestionAndAnswers, userId: any): Promise<IQuizAndQuestionAndAnswers> {
      const quizData = { ...quiz, userId };
    
      try {
        const { name, duration, topic, questions } = quizData;
        
        if (!name) throw new APIError('Quiz name is required', 400);
        if (!duration) throw new APIError('Quiz duration is required', 400);
        if (!topic) throw new APIError('Quiz topic is required', 400);
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
          throw new APIError('No questions to create a quiz', 400);
        }

        questions.forEach((question: any, index: number) => {
          question.answers.forEach((answer: any, answerIndex: number) => {
            if (!answer.text && !answer.photo) {
              throw new APIError(`Answer at index ${answerIndex} for question ${index} is invalid. Each answer must have text or a photo.`, 400);
            }
          });
        });
    
        const uploadPhoto = async (photo: string, retries = 10, delay = 1000): Promise<string | null> => {
          if (!photo) return null;
    
          try {
            const uploadedImage = await cloudinary.uploader.upload(photo, {
              upload_preset: 'chatapp',
              allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
            });
            
            return uploadedImage.url;
          } catch (error) {
            console.error('Error uploading photo:', error);
            if (retries > 0) {
              console.warn(`Retrying photo upload due to error: ${error}. Retries left: ${retries}`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return uploadPhoto(photo, retries - 1, delay * 2);
            }
            return null;
          }
        };
    
        const uploadPhotosInChunks = async (photos: string[], chunkSize: number): Promise<Map<string, string | null>> => {
          const photoUrlMap = new Map<string, string | null>();
    
          for (let i = 0; i < photos.length; i += chunkSize) {
            const chunk = photos.slice(i, i + chunkSize);
            const results = await Promise.all(chunk.map(photo => uploadPhoto(photo)));
            chunk.forEach((photo, index) => photoUrlMap.set(photo, results[index]));
          }
    
          return photoUrlMap;
        };
    
        const allPhotos: string[] = [];
        quizData.questions.forEach((question: any) => {
          if (question.photo) allPhotos.push(question.photo);
          question.answers.forEach((answer: any) => {
            if (answer.photo) allPhotos.push(answer.photo);
          });
        });
    
        const chunkSize = 20;
        const photoUrlMap = await uploadPhotosInChunks(allPhotos, chunkSize);
    
        quizData.questions.forEach((question: any) => {
          if (question.photo) question.photo = photoUrlMap.get(question.photo) || null;
          question.answers.forEach((answer: any) => {
            if (answer.photo) answer.photo = photoUrlMap.get(answer.photo) || null;
          });
        });
    
        const newQuizAndQuestionsAndAnswers = await this.quizRepository.createQuizAndQuestionsAndAnswers(quizData);
        if (!newQuizAndQuestionsAndAnswers) throw new APIError('Quiz not created', 500);
        
        return newQuizAndQuestionsAndAnswers;
    
      } catch (error) {
        console.error('Error creating quiz and questions:', error);
        throw error instanceof APIError ? error : new Error('Error creating quiz and questions');
      }
    }
    
  async getQuizById(quizId: string): Promise<IQuizAndQuestionAndAnswers> {
    const quiz = await this.quizRepository.get(quizId);
    quiz.questions.filter((question: any) => question.correctAnswer = undefined)
    if (!quiz) throw new APIError('Quiz not found', 404);
    return quiz;
  }


  async deleteQuiz(quizId: string, userId: string): Promise<IQuizAndQuestionAndAnswers> {
    const quizExists = await this.quizRepository.get(quizId);
    
    if (quizExists.userId !== userId) throw new APIError('You r not Authorized to delete this quiz', 403);
    
    if (!quizExists) throw new APIError('Quiz not found', 404);
    
    const deleted = this.quizRepository.delete(quizExists.id);
    
    return deleted
  }
 
  async getQuizs(): Promise<IQuizAndQuestionAndAnswers[]> {
    return this.quizRepository.list();
  }
  async getQuizsICreated(userId: string): Promise<IQuizAndQuestionAndAnswers[]> {
    const quizs = await this.quizRepository.getQuizsICreated(userId);
    
    if (!quizs) throw new APIError('No user quizs found', 404);
    return quizs
  }
  async checkAnswers(solvedQuestions: { questionId: string, answersId: string }[]): Promise<{ questionId: string, answersId: string, correctAnswer: string, isAnswer: boolean }[]> {
    const updatedSolvedQuestions = await Promise.all(solvedQuestions.map(async (solvedQuestion) => {
      const { questionId, answersId } = solvedQuestion;

      const question = await this.quizRepository.getQuestion(questionId);
      
      if (!question) {
        return { ...solvedQuestion, correctAnswer: question.correctAnswer, isAnswer: false };
      }
  
      const isAnswerCorrect = question.correctAnswer === answersId;
      
      return { ...solvedQuestion, correctAnswer: question.correctAnswer, isAnswer: isAnswerCorrect };
    }));
  
    return updatedSolvedQuestions;
  }
  
}

export default QuizUseCase;
