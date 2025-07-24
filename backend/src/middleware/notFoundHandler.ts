import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      public: [
        'GET /api/health',
        'POST /api/reports',
        'GET /api/reports',
        'POST /api/auth/login'
      ],
      admin: [
        'GET /api/admin/reports',
        'PUT /api/admin/reports/:id',
        'DELETE /api/admin/reports/:id',
        'POST /api/admin/invite',
        'GET /api/admin/dashboard/stats'
      ]
    }
  });
};
