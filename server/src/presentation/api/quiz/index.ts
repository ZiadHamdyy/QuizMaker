import express from 'express';
import QuizController from './quizController';
import QuizUsecase from '../../../application/QuizUsecase';
import QuizRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaQuizRepository';
import UserRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';

const router = express.Router();
const quizRepository = new QuizRepository();
const userRepository = new UserRepository();
const quizUsecase = new QuizUsecase(quizRepository, userRepository);
const quizController = new QuizController(quizUsecase); 

router.get('/', quizController.getQuizs);
router.get('/userQuizs', quizController.getQuizsICreated);
router.post('/checkanswers', quizController.checkAnswers);
router.post('/', quizController.createQuizAndQuestionsAndAnswers);
router.get('/:id', quizController.getQuizById);
router.delete('/:id', quizController.deleteQuiz);

export default router;
