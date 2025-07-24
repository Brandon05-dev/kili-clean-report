import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No valid authorization header provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Fetch admin details from database
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, role, isActive, isVerified')
      .eq('id', decoded.adminId)
      .single();

    if (error || !admin) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    if (!admin.isActive || !admin.isVerified) {
      res.status(403).json({
        success: false,
        error: 'Account is not active or verified'
      });
      return;
    }

    // Attach admin info to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.admin.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(['Super Admin']);
export const requireAdminOrAbove = requireRole(['Super Admin', 'Admin']);
export const requireAnyAdminRole = requireRole(['Super Admin', 'Admin', 'Moderator']);
