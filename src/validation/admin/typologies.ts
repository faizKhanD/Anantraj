import Joi from "joi";

export const TypologySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.number().valid(0, 1).optional(),
});

export const UpdateTypologySchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.number().valid(0, 1).optional(),
});

export const SubTypologySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.number().valid(0, 1).optional(),
});

export const UpdateSubTypologySchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.number().valid(0, 1).optional(),
});
