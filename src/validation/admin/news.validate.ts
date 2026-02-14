import Joi from 'joi';


export const NewsSchema = Joi.object({

    short_description: Joi.string().required().messages({
        'any.required': 'short_description is required',
    }),
    image: Joi.string().optional().allow(""),
    link: Joi.string().optional().allow(""),
    logo: Joi.string().optional().allow(""),
    alt: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
    date_at:Joi.string().required().messages({
        'any.required': 'date_at is required',
    })

});
