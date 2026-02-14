import Joi from "joi";

export const InvestorTypesSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.number().valid(0, 1).optional(),
});

export const UpdateInvestorTypesSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.number().valid(0, 1).optional(),
});

export const SubInvestorTypesSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.number().valid(0, 1).optional(),
});

export const UpdateSubInvestorTypesSchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.number().valid(0, 1).optional(),
});
