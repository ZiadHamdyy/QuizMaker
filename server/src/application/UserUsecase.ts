import IUser from '../domain/model/IUser';
import UserRepository from '../domain/repository/userRepository';
import APIError from './Errors/APIError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
const cloudinary = require('../cloudinary/cloudinary')
class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: IUser): Promise<IUser> {
    const { name, email, password, photo} = user;
    let uploadedImage:any = ""
        if (photo){
                uploadedImage = await cloudinary.uploader.upload(photo, {
                upload_preset: "chatapp",
                allowed_formats: ["jpg", "png", "jpeg", "svg", "ico", "jfif", "webp"],
            });
        }
        
    if (!name && !email && !password)
      throw new APIError('All fields required.', 400);
    if (!name) throw new APIError('Name is required.', 400);
    if (!email) throw new APIError('Email is required.', 400);
    if (!password) throw new APIError('Password is required.', 400);
    const isUserExist = await this.userRepository.getByEmail(email);

    if (isUserExist) throw new APIError('This email is already exist.', 409);
    if (!validator.isEmail(email))
      throw new APIError('This is not an email.', 400);
    if (!validator.isStrongPassword(password))
      throw new APIError('Password not strong.', 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.photo = uploadedImage ? uploadedImage.url : null;
    const newUser = await this.userRepository.create(user);

    if (!newUser) throw new APIError('User not created', 500);

    return newUser;
  }
  async loginUser(user: IUser) {
    const { email, password } = user;

    if (!email && !password) throw new APIError('All fields required.', 400);
    if (!email) throw new APIError('Email is required.', 400);
    if (!password) throw new APIError('Password is required.', 400);

    if (!validator.isEmail(email))
      throw new APIError('This is not an Email.', 400);
    const isUserExist = await this.userRepository.getByEmail(email);

    if (!isUserExist) throw new APIError('This email is not exist.', 400);

    const isPasswordValid = await bcrypt.compare(password, isUserExist.password);
    if (!isPasswordValid) throw new APIError('Invalid password', 401);
    
    const { password: _, ...userWithoutPassword } = isUserExist;
    return userWithoutPassword;
  }
  async generateNewAccessToken(cookies:any){
      if(!cookies?.refreshToken) throw new APIError('Unauthorized', 401);
      const refreshToken = cookies.refreshToken;
      
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };
      if (!decoded) throw new APIError('Could not refresh access token', 403);
      const findUser = await this.userRepository.get(decoded.id);
      if (!findUser) throw new APIError('Unauthorized', 401);
      const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
      return {accessToken, refreshToken};
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new APIError('User not found.', 404);
    }

    return user;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.get(userId);
    if (!user) throw new APIError('User not found', 404);
    return user;
  }

  async updateUser(userId: string, user: IUser): Promise<IUser> {
    const userExists = await this.userRepository.get(userId);
    if (!userExists) throw new APIError('User not found', 404);
    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) throw new APIError('User not updated', 500);

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const userExists = await this.userRepository.get(userId);
    if (!userExists) throw new APIError('User not found', 404);
    return this.userRepository.delete(userId);
  }
}

export default UserUseCase;