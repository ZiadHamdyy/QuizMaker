interface IUserRepository {
  create(data: any): Promise<any>;
  get(id: string): Promise<any>;
  getByEmail(email: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}

export default IUserRepository;
