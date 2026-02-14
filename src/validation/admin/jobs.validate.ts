import Joi from "joi";

export const JobSchema = Joi.object({
  job_title: Joi.string().min(2).max(100).required(),
  location: Joi.string().min(2).max(100).required(),
  education_required: Joi.string().min(2).required(),
  experience_required: Joi.string().required(),
  skills_required: Joi.string().min(2).required(),
  status: Joi.string().valid(0, 1).optional(),
});


export const JobFormSchama = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.number().min(5).required(),
  email: Joi.string().email().required(),
  profile: Joi.string().required(),
  skills: Joi.string().min(2).required(),
  experience: Joi.string().required(),
});

// export const UpdateTypologySchema = Joi.object({
//   name: Joi.string().optional(),
//   status: Joi.number().valid(0, 1).optional(),
// });

// export const SubTypologySchema = Joi.object({
//   name: Joi.string().min(2).max(100).required(),
//   status: Joi.number().valid(0, 1).optional(),
// });

// export const UpdateSubTypologySchema = Joi.object({
//   name: Joi.string().optional(),
//   status: Joi.number().valid(0, 1).optional(),
// });
