import Joi from "joi";

export const createTownshipSectionSchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().required(),
  sub_title: Joi.string().required(),
  other: Joi.object().optional(),
  image: Joi.object().optional(),
  description: Joi.string().optional(),
});

export const updateTownshipSectionSchema = Joi.object({
  title: Joi.string().optional(),
  type: Joi.string().optional(),
  sub_title: Joi.string().optional(),
  other: Joi.object().optional(),
  image: Joi.object().optional(),
  description: Joi.string().optional(),
});


export const TownshipAmenities = Joi.object({
  amenities_logo_id: Joi.number().required(),
  title: Joi.string().optional().allow(""),
  d_images: Joi.string().optional().allow(""),
  m_image: Joi.string().optional(),
  alt_text: Joi.string().optional().allow(""),
});
