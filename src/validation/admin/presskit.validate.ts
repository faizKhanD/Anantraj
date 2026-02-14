import Joi, { allow } from 'joi';


export const PressKitSchema = Joi.object({
  
    title: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    image: Joi.string().optional().allow(''),
    alt_text: Joi.string().optional().allow(null, ''),
});