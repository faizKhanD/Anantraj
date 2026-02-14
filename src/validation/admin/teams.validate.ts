import Joi from 'joi';


export const TeamSchema = Joi.object({
    is_team_board: Joi.number().required().messages({
        'any.required': 'is_team_board is required',
    }),
    name: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    designation: Joi.string().required().messages({
        'any.required': 'short_description is required',
    }),
    short_description: Joi.string().optional().allow(null, ''),
    long_description: Joi.string().optional().allow(null, ''),
    alt: Joi.string().optional().allow(null, ''),
    status: Joi.number().optional(),
    seq: Joi.number().optional(),
    home_seq: Joi.number().optional(),
    directorship: Joi.string().optional().allow(null, {}),
    din_number: Joi.string().optional(),
    is_leadership: Joi.number().optional(),
    
});