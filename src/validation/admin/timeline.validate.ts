import Joi from 'joi';


export const TimelineSchema = Joi.object({
    short_description: Joi.string().required().messages({
        'any.required': 'short_description is required',
    }),
    image: Joi.string().optional().allow(""),
    alt: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
    year: Joi.number().required().messages({
        'any.required': 'year is required',
        'number.base': 'year must be a number',
    }),
});