import Joi from "joi";
export const AwardSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "short_description is required",
  }),
  alt_txt: Joi.string().optional(),
  year: Joi.string().optional(),
  status: Joi.number().default(1),
});
