import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details
      });
      return;
    }

    next();
  };
};

// Report validation schemas
export const createReportSchema = Joi.object({
  description: Joi.string().min(10).max(1000).required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
  photoUrl: Joi.string().uri().optional()
    .messages({
      'string.uri': 'Photo URL must be a valid URL'
    }),
  lat: Joi.number().min(-90).max(90).required()
    .messages({
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  lng: Joi.number().min(-180).max(180).required()
    .messages({
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    }),
  category: Joi.string().valid(
    'Waste Management',
    'Water Pollution',
    'Air Pollution',
    'Noise Pollution',
    'Illegal Dumping',
    'Sewage Issues',
    'Road Damage',
    'Other'
  ).optional(),
  reporterEmail: Joi.string().email().optional()
    .messages({
      'string.email': 'Reporter email must be a valid email address'
    }),
  reporterPhone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).optional()
    .messages({
      'string.pattern.base': 'Reporter phone must be a valid international phone number'
    }),
  address: Joi.string().max(200).optional()
    .messages({
      'string.max': 'Address cannot exceed 200 characters'
    })
});

export const updateReportSchema = Joi.object({
  description: Joi.string().min(10).max(1000).optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Resolved', 'Rejected').optional(),
  assignedTo: Joi.string().uuid().optional(),
  adminNotes: Joi.string().max(500).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  category: Joi.string().valid(
    'Waste Management',
    'Water Pollution',
    'Air Pollution',
    'Noise Pollution',
    'Illegal Dumping',
    'Sewage Issues',
    'Road Damage',
    'Other'
  ).optional()
});

// Admin validation schemas
export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

export const inviteAdminSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  phone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required()
    .messages({
      'string.pattern.base': 'Phone must be a valid international phone number',
      'any.required': 'Phone is required'
    }),
  firstName: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  role: Joi.string().valid('Super Admin', 'Admin', 'Moderator').required()
    .messages({
      'any.only': 'Role must be one of: Super Admin, Admin, Moderator',
      'any.required': 'Role is required'
    })
});

export const completeInvitationSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'any.required': 'Invitation token is required'
    }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  verificationCode: Joi.string().length(6).pattern(/^\d{6}$/).required()
    .messages({
      'string.length': 'Verification code must be exactly 6 digits',
      'string.pattern.base': 'Verification code must contain only numbers',
      'any.required': 'Verification code is required'
    })
});
