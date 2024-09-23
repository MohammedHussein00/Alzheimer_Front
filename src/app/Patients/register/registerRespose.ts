export interface SignUp {
  message:string;
  name:string;
  email:string;
  role:string;
  token:string;
  expiredOn:Date;
  isAuthenticated:boolean;
  emailConfirmed:boolean;
}
