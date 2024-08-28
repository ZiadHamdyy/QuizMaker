interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  photo: any | null;
  dayOfBirth: Date | null;
}

export default IUser;
