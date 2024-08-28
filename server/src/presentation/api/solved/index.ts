import express from 'express';
import SolvedController from './solvedController';
import SolvedUsecase from '../../../application/SolvedUsecase';
import SolvedRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaSolvedRepository';
import UserRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';

const router = express.Router();
const solvedRepository = new SolvedRepository();
const userRepository = new UserRepository();
const solvedUsecase = new SolvedUsecase(solvedRepository, userRepository);
const solvedController = new SolvedController(solvedUsecase); 

router.post('/', solvedController.createSolved);
router.get('/', solvedController.getSolvedQuiz);
router.get('/solvedpercentage', solvedController.calculateSolvedQuizPercentage);
router.delete('/:id', solvedController.deleteSolved);

export default router;
