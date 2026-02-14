import Joi from "joi";
export const ConstructionUpdateSubProjectSchema = Joi.object({
  construction_project_id: Joi.number().required().messages({
    "any.required": "construction_project_id is required",
  }),
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  status: Joi.number().default(1),
});
