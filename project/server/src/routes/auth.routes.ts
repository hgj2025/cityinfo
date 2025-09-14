import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Registration validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('nationality').optional().isString().trim(),
  body('languagePreference').optional().isString().trim(),
  body('ageGroup').optional().isString().trim(),
  body('phoneNumber').optional().isString().trim(),
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Profile update validation rules
const updateProfileValidation = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name cannot be empty'),
  body('nationality').optional().isString().trim(),
  body('languagePreference').optional().isString().trim(),
  body('ageGroup').optional().isString().trim(),
  body('phoneNumber').optional().isString().trim(),
];

// Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, validateRequest, updateProfile);

export default router;