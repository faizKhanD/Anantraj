import Joi from 'joi';


export const BrandPillarSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    short_description: Joi.string().required().messages({
        'any.required': 'short_description is required',
    }),
    status: Joi.number().optional(),
});