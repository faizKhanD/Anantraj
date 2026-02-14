import Joi from 'joi';


export const amenitiesLogoSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'year is required',
    }),
    logo: Joi.string().optional().allow(null, ''),
    alt: Joi.string().optional().allow(null, ''),
    status: Joi.number().optional(),
});