import Joi from 'joi';
export const registerAdminSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    name: Joi.string().max(50).optional().messages({
        'string.max': 'First name cannot exceed 50 characters',
    }),
    phone_number: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Phone number must be a 10-digit number',
        }),
});

export interface RegisterAdmin {
    email: string;
    password: string;
    name?: string;
    phone_number?: string;
}