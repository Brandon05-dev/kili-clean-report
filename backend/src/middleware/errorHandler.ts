import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details || error.message
    });
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired'
    });
    return;
  }

  if (error.code === '23505') { // PostgreSQL unique violation
    res.status(409).json({
      success: false,
      error: 'Resource already exists'
    });
    return;
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    res.status(400).json({
      success: false,
      error: 'Invalid reference'
    });
    return;
  }

  // Default to 500 server error
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Something went wrong'
  });
};
