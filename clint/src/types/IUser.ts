interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    photo: string | null;
    age: number | null;
    isAdmin: boolean;
  }
  
  export default IUser;
  