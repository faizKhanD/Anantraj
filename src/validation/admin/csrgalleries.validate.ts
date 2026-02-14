import Joi from 'joi';


export const CsrGallerieSchema = Joi.object({
    year: Joi.number().required().messages({
        'any.required': 'year is required',
    }),
    image: Joi.string().optional().allow(null, ''),
    alt: Joi.string().optional().allow(null, ''),
    status: Joi.number().optional(),
});