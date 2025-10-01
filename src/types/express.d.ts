import UserModel from '../Models/UserModel';

declare global {
  namespace Express {
    interface Request {
      user?: typeof UserModel extends { new (...args: any[]): infer U } ? U : any;
    }
  }
}
