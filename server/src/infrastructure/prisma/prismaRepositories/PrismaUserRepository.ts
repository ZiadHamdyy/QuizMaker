import IUserRepository from '../../../domain/repository/userRepository';
import IUser from '../../../domain/model/IUser';
import prisma from '../../prisma/PrismaClient';

class PrismaUserRepository implements IUserRepository {
  async create(data: any): Promise<any> {
    
    const user = await prisma.user.create({ data });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async get(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }
  async getByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async update(id: string, data: any): Promise<IUser> {
    const user = await prisma.user.update({ where: { id }, data });
    return user;
  }

  async delete(id: string): Promise<IUser> {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }

/*   async list(): Promise<IUser[]> {
    const user = await prisma.user.findMany();
    return user;
  } */
}

export default PrismaUserRepository;

