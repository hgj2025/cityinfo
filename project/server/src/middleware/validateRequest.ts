import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg
    }));
    
    console.log('Validation errors:', errorMessages);
    throw new AppError(400, 'Validation failed');
  }
  next();
};