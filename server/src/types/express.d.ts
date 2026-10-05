import type { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: Document & {
        _id: unknown;
        name?: string;
        email?: string;
        avatar?: string;
        role?: 'student' | 'instructor' | 'admin';
      };
    }
  }

  interface Error {
    statusCode?: number;
  }
}

export {};
