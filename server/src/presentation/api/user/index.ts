import express from 'express';
import UserController from './userController';
import UserUsecase from '../../../application/UserUsecase';
import UserRepository from '../../../infrastructure/prisma/prismaRepositories/PrismaUserRepository';

const router = express.Router();
const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository);
const userController = new UserController(userUsecase); 

router.get('/', userController.getUserById);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

export default router;
