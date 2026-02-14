import Joi from "joi";
import { title } from "process";

export const ProjectSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional().allow(""),
  rera_no: Joi.string().optional().allow(""),
  alt: Joi.string().optional().allow(""),
  short_description: Joi.string().optional().allow(""),
  status: Joi.number().valid(0, 1).default(1),
  meta_title: Joi.string().optional().allow(""),
  meta_description: Joi.string().optional().allow(""),
  meta_keywords: Joi.string().optional().allow(""),
  platterId: Joi.number().required(),
  typologyId: Joi.number().required(),
  subTypologyId: Joi.number().required(),
  projectStatusId: Joi.number().required(),
  link: Joi.string().required(),
  seo_tags: Joi.string().optional().allow(""),
  body_tags: Joi.string().optional().allow(""),
});




export const BannerSchama = Joi.object({
  project_id:Joi.number().required(),
  alt_text: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const BannerUpdateSchama = Joi.object({
  alt_text: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const ProjectSectionsSchema = Joi.object({
  project_id:Joi.number().required(),
  type: Joi.string()
  .valid("overview", "amenities","highlight","floor_plan","location_advantage","gallery","specification") 
  .required(),
  other: Joi.alternatives().try(
  Joi.string(),
  Joi.number(),
  Joi.boolean(),
  Joi.object(),
  Joi.array(),
  Joi.valid(null) 
),
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  d_images: Joi.string().optional().allow(""),
  m_image: Joi.string().optional(),
  sequence: Joi.number().optional(),

  
});


// Amenities Schema
export const AmenitieSchama = Joi.object({
  project_id:Joi.number().required(),
  logo_id:Joi.number().required(),
  title: Joi.string().required(),
  short_description: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const AmenitieUpdateSchama = Joi.object({
  logo_id: Joi.string().required(),
  title: Joi.string().required(),
  short_description: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});
// end Amenities Schema


// Highlights Schema
export const HighlightSchama = Joi.object({
  project_id:Joi.number().required(),
  title: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const HighlightUpdateSchama = Joi.object({
  title: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});
// end Highlights Schema




// Specification Schema
export const SpecificationSchama = Joi.object({
  project_id:Joi.number().required(),
  title: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const SpecificationUpdateSchama = Joi.object({
  title: Joi.string().required(),
  alt: Joi.string().optional(),
  status: Joi.number().default(1),
});
// end Specification Schema



// Floorplans Schema
export const FloorplanSchama = Joi.object({
  project_id:Joi.number().required(),
  sub_typologie_id:Joi.number().allow(""),
  image: Joi.string().optional(),
  title: Joi.string().allow(""),
  alt: Joi.string().optional(),
  type: Joi.string().valid("floorplan", "masterplan").required(),
  status: Joi.number().default(1),
});


export const FloorplanUpdateSchama = Joi.object({
  sub_typologie_id: Joi.number().allow(""),
  title: Joi.string().allow(""),
  alt: Joi.string().optional(),
  type: Joi.string().valid("floorplan", "masterplan").optional(),
  status: Joi.number().default(1),
});
// end Floorplans Schema


// Floorplans Schema
export const LocationSchama = Joi.object({
  project_id:Joi.number().required(),
  destination_id:Joi.number().required(),
  title: Joi.string().required(),
  image: Joi.string().optional(),
  alt: Joi.string().optional(),
  distance_time: Joi.string().optional(),
  status: Joi.number().default(1),
});


export const LocationUpdateSchama = Joi.object({
  destination_id: Joi.number().required(),
  title: Joi.string().required(),
  alt: Joi.string().optional(),
  distance_time: Joi.string().optional(),
  status: Joi.number().default(1),
});
// end Floorplans Schema



// Project Galleries Schema
export const GalleriesSchama = Joi.object({
  project_id:Joi.number().required(),
  image: Joi.string().optional(),
  alt: Joi.string().optional(),
  type: Joi.string().valid("image", "video").required(),
  video_link: Joi.string().allow(null, "").optional(),
  year: Joi.string().optional(),
  is_construction:Joi.number().optional(),
  status: Joi.number().default(1),
});


export const GalleriesUpdateSchama = Joi.object({
  alt: Joi.string().optional(),
  year: Joi.string().optional(),
  type: Joi.string().valid("image", "video").required(),
  video_link: Joi.string().allow(null, "").optional(),
  is_construction:Joi.number().optional(),
  status: Joi.number().default(1),
});
// end Project Galleries Schema





export const saveEnquirySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  mobile: Joi.number().required().messages({
    "any.required": "mobile is required",
  }),
  email: Joi.string().required().messages({
    "any.required": "email is required",
  }),
  message: Joi.string().required().messages({
    "any.required": "message is required",
  }),
  project_id: Joi.number().optional(),
  status: Joi.number().default(1),
});
