import Joi from 'joi';
export const BlogFaqSchema = Joi.object({
    question: Joi.string().required().messages({
        'any.required': 'question is required',
    }),
    answer: Joi.string().required().messages({
        'any.required': 'answer is required',
    }),
});
