import Joi from 'joi';


export const CsrGallerieSchema = Joi.object({
    is_type: Joi.number().required().messages({
        'any.required': 'Type is required',
    }),
    label: Joi.string().required().messages({
        'any.required': 'Label field is required',
    }),
    image: Joi.string().optional().allow(null, ''),
    alt: Joi.string().optional().allow(null, ''),
    status: Joi.number().optional(),
});