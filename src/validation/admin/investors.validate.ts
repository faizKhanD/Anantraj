import Joi, { allow } from 'joi';


export const InvestorSchema = Joi.object({
  
    parent_id: Joi.number().optional().allow(""),
    year: Joi.string().optional().allow(""),
    title: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    description: Joi.string().optional().allow(""),
    file: Joi.string().optional().allow(''),
    other: Joi.string().optional().allow(''),
    permissions: Joi.string().optional().allow(''),
    files_to_replace: Joi.string().optional().allow(''),
    link: Joi.string().optional().allow(''),
    
});