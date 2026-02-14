import Joi from 'joi';
export const OurStoryAndManifastoSchema = Joi.object({
    type: Joi.string().required().messages({
        'any.required': 'type is required',
    }),
    image: Joi.string().optional().allow(""),
    alt_text: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
    sequence: Joi.number().optional(),
});
export const OurStoryAndManifastoUpdateSchema = Joi.object({
  
    image: Joi.string().optional().allow(""),
    alt_text: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
    sequence: Joi.number().optional(),
});
