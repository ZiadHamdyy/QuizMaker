interface ISolvedRepository {
  create(data: any): Promise<any>;
  get(id: string): Promise<any>;
  getSolvedQuiz(userId: string): Promise<any>;
  getScoreByQuizId(quizId: string): Promise<any>;
  calculateSolvedQuizPercentage(userId: string): Promise<any>;
  getquiz(quizId: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  list(): Promise<any>;
}

export default ISolvedRepository;
