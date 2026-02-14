import Joi, { alt } from 'joi';
export const BlogSchema = Joi.object({
    slug: Joi.string().required().messages({
        'any.required': 'slug is required',
    }),
    title: Joi.string().required().messages({
        'any.required': 'title is required',
    }),
    short_description: Joi.string().required().messages({
        'any.required': 'short_description is required',
    }),
    image: Joi.string().optional().allow(""),
    mobile_image: Joi.string().optional().allow(""),
    alt: Joi.string().optional().allow(""),
    long_description: Joi.string().required().messages({
        'any.required': 'long_description is required',
    }),
    meta_title: Joi.string().optional().allow(""),
    meta_description: Joi.string().optional().allow(""),
    meta_keywords: Joi.string().optional().allow(""),
    seo_tags: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
    date_at: Joi.string().optional(),
});
