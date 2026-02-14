import Joi from 'joi';
export const AwardGallerySchema = Joi.object({
    award_id:Joi.number().required(),
    image: Joi.string().optional().allow(""),
    alt_text: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
});


export const AwardGalleryUpdateSchema = Joi.object({
    image: Joi.string().optional().allow(""),
    alt_text: Joi.string().optional().allow(""),
    status: Joi.number().optional(),
});
