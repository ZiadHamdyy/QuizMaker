interface IQuizRepository {
  createQuizAndQuestionsAndAnswers(data: any): Promise<any>;
  get(id: string): Promise<any>;
  getQuestion(questionId: string): Promise<any>;
  getQuizsICreated(userId: string): Promise<any[]>
  delete(id: string): Promise<any>; 
  list(): Promise<any>;
}

export default IQuizRepository;
