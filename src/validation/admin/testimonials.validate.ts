import Joi from 'joi';


export const TestimonialSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    short_description: Joi.string().optional().allow(null, ''),
    alt: Joi.string().optional().allow(null, ''),
    image: Joi.string().optional().allow(null, ''),
    video_link: Joi.string().optional().allow(null, ''),
    status: Joi.number().optional(),
    seq: Joi.number().optional(),
    rating: Joi.number().min(1).max(5)
});