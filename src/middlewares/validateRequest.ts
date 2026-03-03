import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { AppError } from './errorHandler';

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
    
    next();
  };
};