import Joi from "joi";

export const PlatterSchema = Joi.object({
  name: Joi.string().required(),
  short_description: Joi.string(),
  heading: Joi.string().optional(),
  platter_overview: Joi.string().optional(),
  sub_heading: Joi.string().optional(),
  alt: Joi.string().optional(),
  status: Joi.number().valid(0, 1).default(1),
  meta_title: Joi.string().optional().allow(""),
  meta_description: Joi.string().optional().allow(""),
  meta_keywords: Joi.string().optional().allow(""),
  seo_tags: Joi.string().optional().allow(""),
  body_tags: Joi.string().optional().allow(""),
  seq: Joi.number().optional(),
  link: Joi.string().optional(),
});

export const UpdatePlatterSchema = Joi.object({
  name: Joi.string().optional(),
  short_description: Joi.string().optional(),
  heading: Joi.string().optional(),
  platter_overview: Joi.string().optional(),
  sub_heading: Joi.string().optional(),
  alt: Joi.string().optional(),
  image: Joi.string().optional(),
  mobile_image: Joi.string().optional(),
  status: Joi.number().valid(0, 1).optional(),
  meta_title: Joi.string().optional().allow(""),
  meta_description: Joi.string().optional().allow(""),
  meta_keywords: Joi.string().optional().allow(""),
  seo_tags: Joi.string().optional().allow(""),
  body_tags: Joi.string().optional().allow(""),
  seq: Joi.number().optional(),
  link: Joi.string().optional(),
});





 
export const LocationSchama = Joi.object({
  title: Joi.string().required(),
  distance_time: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const LocationUpdateSchama = Joi.object({
  title: Joi.string().required(),
  distance_time: Joi.string().optional(),
  status: Joi.number().default(1),
});
 
