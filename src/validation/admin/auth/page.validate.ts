import Joi from "joi";
export const PageSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  meta_title: Joi.string().optional().allow(""),
  meta_description: Joi.string().optional().allow(""),
  meta_keywords: Joi.string().optional().allow(""),
  seo_tags: Joi.string().optional().allow(""),
  body_tags: Joi.string().optional().allow(""),
  status: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const OtherSections = Joi.object({
  type: Joi.string()
    .valid(
      "home_banner",
      "career_overview",
      "home_page_counter",
      "about_us_overview",
      "vison_and_mission",
      "contact_info",
      "csr_overview",
      "home_page_overview",
      "media_center_overview",
      "blog_overview",
      "testimonial_overview",
      "awards_overview",
      "gallery_overview",
      "investor_overview",
      "township_overview",
      "team_categories_overview"
    ) // ✅ only allow these
    .required(),
  other: Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.object(),
    Joi.array(),
    Joi.valid(null)
  ),
  title: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),
  d_images: Joi.string().optional().allow(""),
  m_image: Joi.string().optional(),
  alt_text: Joi.string().optional().allow(""),
});
