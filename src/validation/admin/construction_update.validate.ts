import Joi from "joi";
export const ConstructionUpdateSchema = Joi.object({
  platter_id: Joi.number().required().messages({
    "any.required": "platterId is required",
  }),
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  status: Joi.number().default(1),
});



export const ConstructionUpdateProjectGallerySchema = Joi.object({
  construction_update_project_id: Joi.number().required().messages({
    "any.required": "construction_update_project_id is required",
  }),
  construction_update_sub_project_id: Joi.number().optional(),
  type: Joi.string().required().messages({
    "any.required": "type is required",
  }),
  month_year: Joi.string().required().messages({
    "any.required": "month_year is required",
  }),
  video_link: Joi.string().optional()  ,
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});
