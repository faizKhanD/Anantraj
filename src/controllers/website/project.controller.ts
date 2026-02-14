
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";


import Platter from "../../models/platter.model";
import Project from "../../models/project.model";
import { getPresignedUrl } from "../../utils/s3";
import Typology from "../../models/typologies.model";
import SubTypology from "../../models/subtypologies.model";
import { ProjectBannerModel } from "../../models/projects/projectBanner.model";
import { ProjectSecionModel } from "../../models/projects/projectSections.model";
import { ProjectAmenitiesModel } from "../../models/projects/projectAmenities.model";
import AmenitiesLogo from "../../models/amenitiesLoog.model";
import { ProjectHighlightsModel } from "../../models/projects/projectHighlights.model";
import { ProjectFloorplanModel } from "../../models/projects/projectFloorplan.model";
import { query } from "winston";
import { Error, Model, Op, QueryTypes, Sequelize } from "sequelize";
import { ProjectLocationModel } from "../../models/projects/projectLocation.model";
import { ProjectLocationDestinationModel } from "../../models/projects/projectLocationDestination.model";
import { ProjectGalleriesModel } from "../../models/projects/projectGalleries.model";
import { attachSignedUrls } from "../../utils/helper.utils";
import { EventGalleriesModel } from "../../models/eventGalleries.model";
import { paginate } from "../../utils/paginate.util";
import ProjectStatus from "../../models/projectStatus.model";
import { ProjectSpecificationsModel } from "../../models/projects/projectSpecifications.model";
import { sequelize } from "../../config/sequelize.config";

interface GalleryItem {
  id: number;
  image: string | null;
  year: string;
  [key: string]: any;
}

interface GalleryGroup {
  month_year: string;
  items: GalleryItem[];
}

export const getProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Platter.findAll({
        include: [
          {
            model: Project,
            as: "projects",
            limit: 5,
            order: [["id", "desc"]]
          }
        ],
        where:{
          status:1
        },
        order: [["seq", "ASC"]]
      });

      
const updated = await Promise.all(
  result.map(async (platter) => {
    let data = await attachSignedUrls(platter.toJSON());

    if (data.projects) {
      data.projects = await Promise.all(
        data.projects.map((proj: any) => attachSignedUrls(proj))
      );
    }

    return data;
  })
);

      successResponse(res, "our project list", updated);

    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getProjectSections = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {

      const { project_id } = req.params;
      const data = await ProjectSecionModel.findAll({
        where: {
          project_id
        }
      });
      if (!data) {
        return next({
          status: 404,
          message: "Not Found"
        })
      }

      const result = await Promise.all(
        data.map(async (data: any) => {

          if (data?.banner?.mobile_file) {
            data.banner.mobile_file = await getPresignedUrl(data.banner.mobile_file, 60 * 60 * 24);
          }
          if (data?.banner?.desktop_file) {
            data.banner.desktop_file = await getPresignedUrl(data.banner.desktop_file, 60 * 60 * 24);
          }
          return data;
        })
      );



      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
)

export const getProjectData = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await Project.findOne({
        where: {
          slug: slug
        },
        attributes: {
          exclude: ["typology_id"]
        },
        include: [
          {
            model: ProjectStatus,
            as: "status_data"
          },
          {
            model: Typology,
            as: "typology_data"
          },
          {
            model: SubTypology,
            as: "sub_typology_data"
          }
        ]

      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found"
        })
      }
      if (result?.image) {
        result.image = await getPresignedUrl(result.image, 60 * 60 * 24);
      }

      if (result?.qr_logo) {
        result.qr_logo = await getPresignedUrl(result.qr_logo, 60 * 60 * 24);
      }

      if (result?.logo) {
        result.logo = await getPresignedUrl(result.logo, 60 * 60 * 24);
      }

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
)
export const getBanner = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

      const data = await ProjectBannerModel.findAll({
        where: {
          project_id
        }
      })
      const result = await Promise.all(
        data.map(async (data: any) => {

          if (data?.mobile_file) {
            data.mobile_file = await getPresignedUrl(data.mobile_file, 60 * 60 * 24);
          }
          if (data?.desktop_file) {
            data.desktop_file = await getPresignedUrl(data.desktop_file, 60 * 60 * 24);
          }
          return data;
        })
      );

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

  })




export const getProjectAmenities = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

      const data = await ProjectAmenitiesModel.findAll({
        where: {
          project_id
        },
        include: [
          {
            model: AmenitiesLogo,
            as: "amenities_data"
          }
        ]
      })
      const result = await Promise.all(
        data.map(async (data: any) => {
          if (data?.amenities_data?.logo) {
            data.amenities_data.logo = await getPresignedUrl(data?.amenities_data?.logo, 60 * 60 * 24);

          }

          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );

      successResponse(res, "succsssssssess", data);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

  })




export const getHighlights = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

      const data = await ProjectHighlightsModel.findAll({
        where: {
          project_id
        }
      })
      const result = await Promise.all(
        data.map(async (data: any) => {

          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

})


export const getSpecifications = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

      const data = await ProjectSpecificationsModel.findAll({
        where: {
          project_id
        }
      })
      const result = await Promise.all(
        data.map(async (data: any) => {

          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

})

  
export const getFloorPlans = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

       const where:any={project_id};
     
      const {type}=req.query;
      
      if (type) {
        where[Op.and] = [
          { type: type } 
        ];
      }

      // const data = await ProjectFloorplanModel.findAll({
      //   where,
      //   include: [
      //     {
      //       model: SubTypology,
      //       as: "sub_typologie_data"
      //     }
      //   ]
      // })

      const data = await SubTypology.findAll({
        include: [
          {
            model: ProjectFloorplanModel,
            as: "ProjectFloorplans",
            where: { project_id },
            required: true, // ensures only destinations that have locations for this project
            attributes: ["id", "title", "image", "alt", "type"],
          },
        ],
        attributes: ["id", "name"],
      });

           const result = await Promise.all(
        data.map(async (item: any) => {
          if (Array.isArray(item.ProjectFloorplans)) {
            item.ProjectFloorplans = await Promise.all(
              item.ProjectFloorplans.map(async (loc: any) => {
                if (loc.image) {
                  loc.image = await getPresignedUrl(loc.image, 60 * 60 * 24);
                }
                return loc;
              })
            );
          }
            return item;
        })
      );


      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

})

  
export const getLocationAdvantage = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;
      const {type}=req.query;

     
     
      const data = await ProjectLocationDestinationModel.findAll({
        include: [
          {
            model: ProjectLocationModel,
            where: { project_id },
            required: true, // ensures only destinations that have locations for this project
            attributes: ["id", "title", "image", "alt", "distance_time"],
          },
        ],
        attributes: ["id", "name"],
      });
          
      const result = await Promise.all(
        data.map(async (item: any) => {
          if (Array.isArray(item.ProjectLocations)) {
            item.ProjectLocations = await Promise.all(
              item.ProjectLocations.map(async (loc: any) => {
                if (loc.image) {
                  loc.image = await getPresignedUrl(loc.image, 60 * 60 * 24);
                }
                return loc;
              })
            );
          }
            return item;
        })
      );

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

})


  
export const getProjectGallery = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

       const where:any={project_id,is_construction:0};
     
      const {type}=req.query;
      
          if (type) {
            where[Op.and] = [
              { type: type } 
            ];
          }

      const data = await ProjectGalleriesModel.findAll({
        where
      })
     
      const result = await Promise.all(
        data.map(async (data: any) => {

          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );

      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

  })


  export const getProjectConstructionGallery = asyncHandler(
  async (req: Request<{ project_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.params;

      const query = `
      SELECT 
        TO_CHAR(CAST(u.year AS DATE), 'Mon YYYY') AS month_year,
        JSON_AGG(u) AS items
      FROM public.project_galleries u
      WHERE u.project_id = :project_id AND u.type = 'image' AND is_construction=1
      GROUP BY TO_CHAR(CAST(u.year AS DATE), 'Mon YYYY')
      ORDER BY MIN(CAST(u.year AS DATE));
    `;


     const images = await sequelize.query<GalleryGroup>(query, {
      replacements: { project_id },
      type: QueryTypes.SELECT,
    });
      const imageWithPresigned = await Promise.all(
      images.map(async (month) => ({
        month_year: month.month_year,
        items: await Promise.all(
          month.items.map(async (img) => ({
            ...img,
            image: img.image
              ? await getPresignedUrl(img.image, 60 * 60 * 24)
              : null,
          }))
        ),
      }))
    );


    //video 


      const videoquery = `
      SELECT 
        TO_CHAR(CAST(u.year AS DATE), 'Mon YYYY') AS month_year,
        JSON_AGG(u) AS items
      FROM public.project_galleries u
      WHERE u.project_id = :project_id AND u.type = 'video' AND is_construction=1
      GROUP BY TO_CHAR(CAST(u.year AS DATE), 'Mon YYYY')
      ORDER BY MIN(CAST(u.year AS DATE));
    `;


     const Videos = await sequelize.query<GalleryGroup>(videoquery, {
      replacements: { project_id },
      type: QueryTypes.SELECT,
    });
      const videoWIthPresignUrl = await Promise.all(
      Videos.map(async (month) => ({
        month_year: month.month_year,
        items: await Promise.all(
          month.items.map(async (img) => ({
            ...img,
            image: img.image
              ? await getPresignedUrl(img.image, 60 * 60 * 24)
              : null,
          }))
        ),
      }))
    );




     
      const result={
        'image':imageWithPresigned,
        'video':videoWIthPresignUrl
      }
    
      successResponse(res, "success", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }

  })



export const getEventGalleries = asyncHandler(
  async (req: Request<{ year: string }>, res: Response, next: NextFunction) => {
    try {

      const { year } = req.params;
      const { limit, offset, page } = paginate(req.query);

      const result = await EventGalleriesModel.findAndCountAll({
        limit,
        offset,
       where: { year: year },
      });
      const response = await Promise.all(
        result.rows.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          return data;
        })
      );
      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "Event gallery retrieved successfully", {
        data: response,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      });
    } catch (error: any) {
     
      next(error);
    }
  }
);



export const getPlatterAndProjectByStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const plattersWithStatuses = await Platter.findAll({
        attributes: ["id", "name", "slug"],
        include: [
          {
            model: ProjectStatus,
            as: "statuses",
            attributes: ["id", "name"],
            through: { attributes: [] },  
            required: false,
          },
        ],
        order: [
          ["id", "ASC"],
          [{ model: ProjectStatus, as: "statuses" }, "id", "ASC"],
        ],
      });
      successResponse(res, "success", plattersWithStatuses);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);




export const getProjectGalleryListByStatusAndPlatter = asyncHandler(
  async (req: Request<{platter_id:number,status:string}>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);


      const result=await ProjectGalleriesModel.findAndCountAll({
          attributes: ["id", "image", "alt", "year", "status", "createdAt", "updatedAt"],
          limit,
          offset,
          include:[
            {
              model:Project,
              attributes:['id','name','slug'],
              as:"project",
              where:{
                platter_id:req.params.platter_id,
                projectStatusId:req.params.status
              }
            }
          ]
  

      })

      const data = await Promise.all(
        result.rows.map(async (data: any) => {

          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );


      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      
      successResponse(res, "success", {
        data: data,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const getTownshipProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result=await Project.findAll({
         include: [
                  {
                    model: Platter,
                    as: "platter"
                  }
                   
                ],
        where:{
          is_township:'1'
        }

      });

      const data = await Promise.all(
        result.map(async (data: any) => {
          if (data?.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          if (data?.logo) {
            data.logo = await getPresignedUrl(data.logo, 60 * 60 * 24);
          }
          if (data?.qr_logo) {
            data.qr_logo = await getPresignedUrl(data.qr_logo, 60 * 60 * 24);
          }
          
          return data;
        })
      );
      successResponse(res, "success", result);

    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);
