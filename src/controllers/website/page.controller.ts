import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger.config";
import { errorResponse, successResponse } from "../../utils/responseHandler.util";
import OtherSections from "../../models/otherSections.model";
import { getPresignedUrl, getPresignedUrlForDownload } from "../../utils/s3";
import Team from "../../models/team.model";
import TeamCategories from "../../models/teamcategories.model";
import Testimonials from "../../models/testimonials.model";
import Pages from "../../models/pages.model";
import BrandPillar from "../../models/brandpillar.model";
import CsrList from "../../models/csrlist.model";
import CsrGalleries from "../../models/csrgalleries.model";
import { paginate } from "../../utils/paginate.util";
import News from "../../models/news.model";
import Platter from "../../models/platter.model";
import careerGalleries from "../../models/careerGalleries.model";
import Jobs from "../../models/jobs.model";
import { CareerJob } from "../../interfaces/job.interface";
import { JobFormSchama } from "../../validation/admin/jobs.validate";
import JobForm from "../../models/jobform.model";
import Award from "../../models/award.model";
import { Op, Order, Sequelize } from "sequelize";
import AwardGallery from "../../models/award-gallery.model";
import ProjectStatus from "../../models/projectStatus.model";
import Project from "../../models/project.model";
import Typology from "../../models/typologies.model";
import SubTypology from "../../models/subtypologies.model";
import OurStoryAndManifasto from "../../models/OurStoryAndManifasto.model";
import { InvestorsModel } from "../../models/investors.model";
import { buildHierarchy } from "../../utils/helper.utils";
import Blog from "../../models/blog.model";
import BlogFaq from "../../models/blogfaq.model";
import PressKit from "../../models/presskit.model";
import logoModel from "../../models/logo.model";
import { TownshipAmenitiesModel } from "../../models/township-amenities.model";
import { ProjectGalleriesModel } from "../../models/projects/projectGalleries.model";
import Timeline from "../../models/timeline.model";
import { TownShipLocationModel } from "../../models/TownshipLocation.model";
import { EventGalleriesModel } from "../../models/eventGalleries.model";
import Enquiry from "../../models/enquiri.model";
import { saveEnquirySchema } from "../../validation/admin/project";
import ConstructionProjects from "../../models/construction_projects.model";
import ConstructionUpdateSubProjects from "../../models/construction_update_sub_projects.model";
import { ConstructionUpdateProjectGalleryModel } from "../../models/ConstructionUpdateprojectGalleries";


interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}

export const getSectionType = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const response = await OtherSections.findOne({
        where: {
          type: type,
        },
      });
      if (response) {
        if (response?.banner) {
          const mobile_image = (response.banner as any).mobile_file;
          const desktop_file = (response.banner as any).desktop_file;
          (response.banner as any).mobile_file = mobile_image
            ? await getPresignedUrl(mobile_image, 60 * 60 * 24)
            : null;
          (response.banner as any).desktop_file = desktop_file
            ? await getPresignedUrl(desktop_file, 60 * 60 * 24)
            : null;
        }

        successResponse(res, "retrive sections", response);
      } else {
        return next({
          status: 404,
          message: " Not Found",
        });
      }
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getLeadeShip = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const teams = await Team.findAll({
        where: {
          is_leadership: 1,
        },
        include: [
          {
            model: TeamCategories,
            as: "commity_member",
          },
        ],
        order: [["home_seq", "ASC"]]
      });

      const result = await Promise.all(
        teams.map(async (team) => {
          const data = team.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          return data;
        })
      );

      successResponse(res, "retrive leadership list", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


// export const getTestimoidal = asyncHandler(
//   async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
//     try {
//       const teams = await Testimonials.findAll();

//       const result = await Promise.all(
//         teams.map(async (team) => {
//           const data = team.toJSON();
//           if (data.image) {
//             data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
//           }
//           return data;
//         })
//       );
//       successResponse(res, "retrive testimoial list", result);
//     } catch (error: any) {
//       logger.error(`Database Error: ${error.message}`);
//       next(error);
//     }
//   }
// );

export const getTestimoidal = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const teams = await Testimonials.findAll();

      const video: any[] = [];
      const customer: any[] = [];

      await Promise.all(
        teams.map(async (team) => {
          const data = team.toJSON();

          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          if (data.video_link && data.video_link.trim() !== "") {
            video.push(data);
          } else {
            customer.push(data);
          }
        })
      );

      const result = { video, customer };

      successResponse(res, "retrieve testimonial list", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getSinglePageRecord = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await Pages.findOne({
        where: {
          slug: slug,
        },
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }
      if (result.banner) {
        result.banner = await getPresignedUrl(result.banner, 60 * 60 * 24);
      }
      if (result.mobile_image) {
        result.mobile_image = await getPresignedUrl(result.mobile_image, 60 * 60 * 24);
      }
      successResponse(res, "retrive page record", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getBrandPillars = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await BrandPillar.findAll();
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }
      successResponse(res, "retrive page record", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAllTeamByCategory = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const categories = await TeamCategories.findAll({
        include: [
          {
            model: Team,
            as: "teams",
          },
        ],
        where: {
          show_tab: 0,
        },
        order: [
          ["seq", "ASC"],                             // order TeamCategories
          [{ model: Team, as: "teams" }, "seq", "ASC"] // order Teams
        ],
      });

      type CategoryWithTeams = {
        id: number;
        name: string;
        teams?: Array<{
          id: number;
          name: string;
          designation: string;
          image?: string | null;
          [key: string]: any;
        }>;
        [key: string]: any;
      };

      const result: CategoryWithTeams[] = await Promise.all(
        categories.map(async (category) => {
          const categoryData =
            category.toJSON() as unknown as CategoryWithTeams;

          if (categoryData.teams?.length) {
            categoryData.teams = await Promise.all(
              categoryData.teams.map(async (team) => {
                if (team.image) {
                  team.image = await getPresignedUrl(team.image, 60 * 60 * 24);
                }
                return team;
              })
            );
          }

          return categoryData;
        })
      );
      successResponse(res, "retrive team list", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


// export const getTeamByCategory = asyncHandler(
//   async (req: Request<{ categories: string,  }>, res: Response, next: NextFunction) => {

//     try {
//       const categories = await TeamCategories.findAll({
//         include: [
//           {
//             model: Team,
//             as: "teams",
//           },
//         ],
//         where: {
//           show_tab: 0,
//           slug: req.params.categories
//         },
//         order: [
//           ["seq", "ASC"],                             // order TeamCategories
//           [{ model: Team, as: "teams" }, "seq", "ASC"] // order Teams
//         ],
//       });

//       type CategoryWithTeams = {
//         id: number;
//         name: string;
//         teams?: Array<{
//           id: number;
//           name: string;
//           designation: string;
//           image?: string | null;
//           [key: string]: any;
//         }>;
//         [key: string]: any;
//       };

//       const result: CategoryWithTeams[] = await Promise.all(
//         categories.map(async (category) => {
//           const categoryData =
//             category.toJSON() as unknown as CategoryWithTeams;

//           if (categoryData.teams?.length) {
//             categoryData.teams = await Promise.all(
//               categoryData.teams.map(async (team) => {
//                 if (team.image) {
//                   team.image = await getPresignedUrl(team.image, 60 * 60 * 24);
//                 }
//                 return team;
//               })
//             );
//           }

//           return categoryData;
//         })
//       );
//       successResponse(res, "retrive team list", result);
//     } catch (error: any) {
//       logger.error(`Database Error: ${error.message}`);
//       next(error);
//     }
//   }
// );


export const getTeamByCategory = asyncHandler(
  async (req: Request<{ categories: string }>, res: Response, next: NextFunction) => {
    try {
      // Fetch a single category by slug
      const category = await TeamCategories.findOne({
        include: [
          {
            model: Team,
            as: "teams",
            required: false,
            order: [["seq", "ASC"]],
          },
        ],
        where: {
          show_tab: 0,
          slug: req.params.categories,
        },
        order: [
          ["seq", "ASC"],
          [{ model: Team, as: "teams" }, "seq", "ASC"],
        ],
      });

      if (!category) {
        return errorResponse(res, "Category not found", 404);
      }

      type CategoryWithTeams = {
        id: number;
        name: string;
        teams: Array<{
          id: number;
          name: string;
          designation: string;
          image?: string | null;
          [key: string]: any;
        }>;
        [key: string]: any;
      };

      const categoryData = category.toJSON() as unknown as CategoryWithTeams;

      if (categoryData.teams?.length) {
        categoryData.teams = await Promise.all(
          categoryData.teams.map(async (team) => {
            if (team.image) {
              team.image = await getPresignedUrl(team.image, 60 * 60 * 24);
            }
            return team;
          })
        );
      }

      successResponse(res, "Retrieved category with teams", categoryData);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const getAllCsrList = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const result = await CsrList.findAll();

      const response = await Promise.all(
        result.map(async (item) => {
          const data = item.toJSON();
          if (data.file) {
            data.file = await getPresignedUrl(data.file, 60 * 60 * 24);
          }
          return data;
        })
      );
      successResponse(res, "retrive csr list", response);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAllCsrGalley = asyncHandler(
  async (req: Request<{ year: string }>, res: Response, next: NextFunction) => {
    try {

      const { year } = req.params;
      const { limit, offset, page } = paginate(req.query);

      const result = await CsrGalleries.findAndCountAll({
        limit,
        offset,

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
      successResponse(res, "csr gallery retrieved successfully", {
        data: response,
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


export const getAllYears = asyncHandler(
  async (req: Request<{ page: string }>, res: Response, next: NextFunction) => {
    try {

      const { page } = req.params;
      const { projectstatus } = req.query;

      let years: any[] = [];
      if (page == 'csr-galleries') {

        years = await CsrGalleries.findAll({
          attributes: [
            [Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"],
          ],
          order: [["year", "DESC"]],
          raw: true,
        });

      } else if (page == 'event-galleries') {
        years = await EventGalleriesModel.findAll({
          attributes: [
            [Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"],
          ],
          order: [["year", "DESC"]],
          raw: true,
        });

      } else {
        return successResponse(res, "No years found", { data: [] });
      }

      const response = years.map((y) => y.year);

      successResponse(res, "Years retrieved successfully", {
        data: response,
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAllNews = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);

      const result = await News.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]], // 👈 order by id descending
      });
      const response = await Promise.all(
        result.rows.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          if (data.logo) {
            data.logo = await getPresignedUrl(data.logo, 60 * 60 * 24);
          }
          return data;
        })
      );
      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "news retrieved successfully", {
        data: response,
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


export const getPlatter = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const result = await Platter.findAndCountAll({
        limit,
        offset,
        order: [["seq", "ASC"]],
      });
      const response = await Promise.all(
        result.rows.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          if (data.mobile_image) {
            data.mobile_image = await getPresignedUrl(
              data.mobile_image,
              60 * 60 * 24
            );
          }
          return data;
        })
      );
      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "platter retrieved successfully", {
        data: response,
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


export const getCareerGalleries = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const result = await careerGalleries.findAndCountAll({
        limit,
        offset,
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
      successResponse(res, "career gallery retrieved successfully", {
        data: response,
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


export const getJobs = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const result = await Jobs.findAndCountAll({
        limit,
        offset,
      });

      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "Jobs retrieved successfully", {
        data: result.rows,
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


export const saveCareerJobs = asyncHandler(
  async (req: MulterRequest<CareerJob>, res: Response, next: NextFunction) => {
    try {
      const { error } = JobFormSchama.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const file = (req.file as Express.MulterS3.File)?.key || null;
      const bodyData: CareerJob = req.body;
      const { name, mobile, email, profile, skills, experience } = bodyData;
      const reseponse = await JobForm.create({
        name,
        mobile: mobile.toString(),
        email,
        profile,
        skills,
        experience,
        resume: file,
        status: "1",
      });

      let imageUrl: string | null = null;

      if (reseponse?.resume) {
        reseponse.resume = await getPresignedUrl(
          reseponse.resume,
          60 * 60 * 24
        );
      }
      const Records = {
        ...reseponse?.toJSON(),
      };
      successResponse(res, "form  submitted successfully", Records);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAllAwards = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const awardsByYear = await Award.findAll({
        attributes: [
          "year",
          [
            Sequelize.literal(
              `json_agg(json_build_object(
                'id', id,
                'title', title,
                'description', description,
                'file', file,
                'alt_txt', alt_txt,
                'status', status
              ))`
            ),
            "awards",
          ],
        ],
        group: ["year"],
        order: [["year", "DESC"]],
        raw: true,
      });

      const formatted = await Promise.all(
        awardsByYear.map(async (yearGroup: any) => {
          const awards = await Promise.all(
            yearGroup.awards.map(async (award: any) => ({
              ...award,
              file: award.file ? await getPresignedUrl(award.file) : null,
            }))
          );
          return { ...yearGroup, awards };
        })
      );

      successResponse(res, "Awards  retrieved successfully", formatted);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAwardGallery = asyncHandler(
  async (req: Request<{ year: string }>, res: Response, next: NextFunction) => {
    try {
      const { year } = req.params;
      const { limit, offset, page } = paginate(req.query);
      const result = await AwardGallery.findAndCountAll({
        include: [
          {
            model: Award,
            as: "award_data",
            attributes: ["id", "year", "title"],
            where: { year: year },
          },
        ],

        limit,
        offset,
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
      successResponse(res, "Gallery retrieved successfully", {
        data: response,
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


export const getPlatterProjects = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    interface ProjectPlain {
      id: number;
      name: string;
      slug: string;
      image?: string | null;
      qr_logo?: string | null;
      [key: string]: any;
    }
    interface StatusPlain {
      id: number;
      name: string;
      projects: ProjectPlain[];
      [key: string]: any;
    }

    try {
      const { slug } = req.params;
      const { limit, offset, page } = paginate(req.query);
      const { search } = req.query;
      let whereCondition = {}
      if (search) {
        whereCondition = {
          name: { [Op.iLike]: `%${search}%` }
        }
      }

      const statuses = await ProjectStatus.findAll({
        include: [
          {
            model: Project,
            as: "projects",
            required: false,
            include: [
              {
                model: Platter,
                as: "platter",
                where: { slug: slug },
              },
              {
                model: Typology,
                as: "typology_data",
              },
              {
                model: SubTypology,
                as: "sub_typology_data",
              },
            ],
            where: whereCondition
          },
        ],
      });

      const result: StatusPlain[] = await Promise.all(
        statuses.map(async (status) => {
          const plainStatus = status.get({ plain: true }) as StatusPlain;

          plainStatus.projects = await Promise.all(
            plainStatus.projects.map(async (project) => ({
              ...project,
              image: project.image
                ? await getPresignedUrl(project.image, 60 * 60 * 24)
                : null,
              qr_logo: project.qr_logo
                ? await getPresignedUrl(project.qr_logo, 60 * 60 * 24)
                : null,
            }))
          );

          return plainStatus;
        })
      );

      successResponse(res, "Projects retrieved successfully", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getPlatterData = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await Platter.findOne({
        where: { slug: slug },
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }
      if (result.image) {
        result.image = await getPresignedUrl(result.image, 60 * 60 * 24);
      }

      result.mobile_image = result.mobile_image ? await getPresignedUrl(result.mobile_image, 60 * 60 * 24) : null


      successResponse(res, "retrive platter record", result);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getProjectBySingleProject = asyncHandler(
  async (req: Request<{ platter_id: string }>, res: Response, next: NextFunction) => {
    try {
      const { platter_id } = req.params;
      const result = await Project.findAndCountAll({
        where: { platterId: platter_id, status: 1 },
        include: [
          {
            model: Platter,
            as: "platter"
          }

        ]

      });

      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }


      const data = await Promise.all(
        result.rows.map(async (item: any) => {

          item.image = item.image ? await getPresignedUrl(item.image, 60 * 60 * 24) : null; // 24h
          item.mobile_image = item.mobile_image ? await getPresignedUrl(item.mobile_image, 60 * 60 * 24) : null; // 24h

          return { ...item.toJSON() };
        })
      );



      successResponse(res, "platter record", { data: data });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);



export const getOurStoryAndManifastro = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const result = await OurStoryAndManifasto.findAll({
        where: { type },
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }

      const response = await Promise.all(
        result.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return data;
        })
      );

      successResponse(res, "retrive  record", response);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getInvestors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { filterTitle, filterParentId } = req.query;
      const where: any = {};

      const data = await InvestorsModel.findAndCountAll({
        where,
        order: [["created_at", "ASC"]],
      });

      const rows = await Promise.all(
        data.rows.map(async (item: any) => {
          const jsonItem = item.toJSON();

          // main file → signed URL
          jsonItem.file = jsonItem.file
            ? await getPresignedUrl(jsonItem.file, 60 * 60 * 24)
            : null;

          // file_list → replace value with signed URL but keep same key
          if (jsonItem.file_list && Array.isArray(jsonItem.file_list)) {
            jsonItem.file_list = await Promise.all(
              jsonItem.file_list.map(async (f: Record<string, string>) => {
                const entries = Object.entries(f);

                // make sure there's at least one entry
                const firstEntry = entries[0];
                if (!firstEntry) return f; // nothing to process

                const [key, value] = firstEntry; // now TS is happy

                if (typeof value === "string" && value !== "-") {
                  return {
                    [key]: await getPresignedUrl(value, 60 * 60 * 24),
                  };
                }

                return { [key]: value };
              })
            );
          }

          return jsonItem;
        })
      );

      // build hierarchy
      const hierarchy = buildHierarchy(rows, filterTitle as number | undefined, filterParentId as number | undefined);

      successResponse(res, "Investors retrieved successfully", {
        data: hierarchy,
      });

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getOurBlogs = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const { order_by } = req.query as { order_by?: string };

      const { limit, offset, page } = paginate(req.query);
      const where = { status: 1 };
      let orderby: Order = [];
      if (order_by) {
        const direction = order_by.toString().toUpperCase() === "ASC" ? "ASC" : "DESC";
        orderby = [["date_at", direction]];
      }
      const result = await Blog.findAndCountAll({
        where,
        limit,
        offset,
        order: orderby
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }

      const response = await Promise.all(
        result.rows.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          if (data.mobile_image) {
            data.mobile_image = await getPresignedUrl(data.mobile_image, 60 * 60 * 24);
          }

          return data;
        })
      );

      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "Blogs retrieved successfully", {
        data: response,
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


export const getBlogBySlug = asyncHandler(
  async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await Blog.findOne({
        where: { slug: slug },
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }

      // ✅ Fetch related BlogFaq records
      const blogFaqs = await BlogFaq.findAll({
        where: { blog_id: result.id },
        order: [["id", "ASC"]],
      });

      if (result.image) {
        result.image = await getPresignedUrl(result.image, 60 * 60 * 24);
      }
      if (result.mobile_image) {
        result.mobile_image = await getPresignedUrl(result.mobile_image, 60 * 60 * 24);
      }
      const data = {
        ...result.toJSON(),
        faqs: blogFaqs,
      };
      successResponse(res, "retrive blog record", data);
    } catch (error: any) {

      logger.error(`Database Error: ${error.message}`);
      next(error);

    }
  }
)


export const getPressKit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const data = await PressKit.findAll({
        include: [
          {
            model: logoModel,
            as: "PressLogos", // 👈 must match the association alias
            required: true,
            attributes: ["id", "image", "alt", "label"],
          },
        ],
        attributes: ["id", "title", "image", "alt_text"],
      });

      const result = await Promise.all(
        data.map(async (item: any) => {
          if (item.image) {
            item.image = await getPresignedUrl(item.image, 60 * 60 * 24);
          }
          if (Array.isArray(item.PressLogos)) {
            item.PressLogos = await Promise.all(
              item.PressLogos.map(async (loc: any) => {
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




export const getTownshipAmenities = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sections = await TownshipAmenitiesModel.findAll();

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }

      const result = await Promise.all(
        sections.map(async (item: any) => {
          const mobile_image = (item.banner as any).mobile_file;
          const desktop_file = (item.banner as any).desktop_file;
          (item.banner as any).mobile_file = mobile_image ? await getPresignedUrl(mobile_image, 60 * 60 * 24) : null;
          (item.banner as any).desktop_file = desktop_file ? await getPresignedUrl(desktop_file, 60 * 60 * 24) : null;

          return item;
        })
      );

      return successResponse(res, "Success", result);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getTownshipLocation = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sections = await TownShipLocationModel.findAll();

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }

      const result = await Promise.all(
        sections.map(async (item: any) => {
          return item;
        })
      );

      return successResponse(res, "Success", result);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getTimeline = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const sections = await Timeline.findAndCountAll({
        where: { status: 1 },
        limit,
        offset,
      });

      if (!sections) {
        return next({
          status: 404,
          message: "timeline Not Found",
        });
      }


      const result = await Promise.all(
        sections.rows.map(async (item: any) => {
          item.image = item.image ? await getPresignedUrl(item.image, 60 * 60 * 24) : null;
          return item;
        })
      );






      const totlaRecords = sections.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "Timeline Retrived successfully", {
        data: result,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      });

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);




export const getGalleriesProjects = asyncHandler(
  async (req: Request<{ platter_id: number }>, res: Response, next: NextFunction) => {
    try {
      const { platter_id } = req.params;

      const data = await ProjectGalleriesModel.findAll({
        include: [
          {
            model: Project,
            as: "project", // must match the alias in association
            required: true,
            attributes: ["id", "name"],
            where: { platter_id },
          },
        ],
        attributes: ["id", "project_id", "image", "alt"],
      });

      const result = await Promise.all(
        data.map(async (item: any) => {
          if (item?.image) {
            item.image = await getPresignedUrl(item.image, 60 * 60 * 24);
          }
          return item;
        })
      );

      successResponse(res, "success", { data: result });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);



export const getUnderConstructionGallery = asyncHandler(
  async (req: Request<{ year: number }>, res: Response, next: NextFunction) => {
    try {

      const { year } = req.params;
      const where: any = { year };

      const data = await ProjectGalleriesModel.findAll({
        where
      })

      const result = await Promise.all(
        data.map(async (data: any) => {

          let imageUrl = null;
          if (data?.image) {
            imageUrl = await getPresignedUrl(data.image, 60 * 60 * 24);
          }

          return {
            id: data.id,
            year: data.year,
            image: imageUrl,
            alt: data.alt,
          };
        })
      );

      successResponse(res, "success", { data: result });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
)




export const getHomeAwards = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const data = await Award.findAll();
      const result = await Promise.all(
        data.map(async (data: any) => {
          if (data?.file) {
            data.file = await getPresignedUrl(data.file, 60 * 60 * 24);
          }
          return data;
        })
      );

      successResponse(res, "success", { data: result });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
)

interface GalleryPagination {
  page: number;
  limit: number;
}


interface Gallery {
  id: number;
  image: string;
  // other properties of Gallery (e.g., description, created_at, etc.)
}


export const getProjectGallery = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Fetch platters with projects and project status
      const platters = await Platter.findAll({
        include: [
          {
            model: Project,
            as: "projects",
            include: [
              {
                model: ProjectStatus,
                as: "status_data",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      const plattersResult: any[] = [];

      // Iterate over platters to enrich projects with galleries
      for (const platter of platters) {
        const platterPlain = platter.get({ plain: true });
        platterPlain.projects = (platterPlain.projects || []) as Project[];

        // For each project in platter, add galleries with presigned URLs
        for (let i = 0; i < platterPlain.projects.length; i++) {
          const project = platterPlain.projects[i] as Project; // Type cast project
          if (!project || !project.id) continue;

          const galleries = await ProjectGalleriesModel.findAndCountAll({
            where: { project_id: project.id },
            limit,
            offset,
            order: [["id", "DESC"]],
          });

          // Convert gallery images to presigned URLs
          const galleriesWithUrl = await Promise.all(
            galleries.rows.map(async (g) => {
              const gallery = g.get({ plain: true });
              gallery.image = gallery.image ? await getPresignedUrl(gallery.image) : null;
              return gallery;
            })
          );

          project.galleries = galleriesWithUrl as Gallery[];
          project.galleriesCount = galleries.count;
        }

        // Add the enriched platter to the result
        plattersResult.push(platterPlain);
      }

      // Send the success response with the paginated and enriched data
      successResponse(res, "success", { data: plattersResult });
    } catch (error: any) {
      // Log the error and pass it to the next middleware
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);




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
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);





export const saveEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { error } = saveEnquirySchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map(err => err.message)
        });
      }

      const { name, mobile, email, message, project_id } = req.body;


      const enquiry = await Enquiry.create({
        name,
        mobile,
        email,
        message,
        project_id,
        status: "0",
      });

      successResponse(res, "Enquiry saved successfully", { enquiry });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);



export const downloadPressKiteFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await logoModel.findOne({
        where: {
          id: id,
        },
      });
      if (!result) {
        return next({
          status: 404,
          message: "Not Found",
        });
      }
      successResponse(res, "PressKit retrieved download", { result });
      if (result?.image) {

        const url = await getPresignedUrlForDownload(result.image, 60 * 60 * 24);
        res.download(url);
      }
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);







export const getConstructionPlatter = asyncHandler(
  async (req: Request<{ type: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const result = await Platter.findAndCountAll({
        where: {
          show_in_construction: 1
        },
        limit,
        offset,
        order: [["seq", "ASC"]],
      });
      const response = await Promise.all(
        result.rows.map(async (item) => {
          const data = item.toJSON();
          if (data.image) {
            data.image = await getPresignedUrl(data.image, 60 * 60 * 24);
          }
          if (data.mobile_image) {
            data.mobile_image = await getPresignedUrl(
              data.mobile_image,
              60 * 60 * 24
            );
          }
          return data;
        })
      );
      const totlaRecords = result.count;
      const totalPages = Math.ceil(totlaRecords / limit);
      successResponse(res, "platter retrieved successfully", {
        data: response,
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
export const getConstructionProjectWithGallery = asyncHandler(
  async (req: Request<{ platter_id: string }>, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { platter_id } = req.params;

      const response = await ConstructionProjects.findAndCountAll({
        include: [
          {
            model: ConstructionUpdateSubProjects,
            as: "subprojects",
            include: [
              {
                model: ConstructionUpdateProjectGalleryModel,
                as: "subproject_galleries",
              },
            ],
          },
          {
            model: ConstructionUpdateProjectGalleryModel,
            as: "project_gallery",
            required: false,
            where: { construction_update_sub_project_id: null },
          },
        ],
        where: { platter_id: platter_id },
        order: [["id", "DESC"]],
      });

      const dataWithUrls = await Promise.all(
        response.rows.map(async (project) => {
          const projectData = project.toJSON();

          projectData.file = projectData.file
            ? await getPresignedUrl(projectData.file, 60 * 60 * 24)
            : null;

          if (projectData.subprojects) {
            projectData.subprojects = await Promise.all(
              projectData.subprojects.map(async (sub: any) => {
                sub.file = sub.file
                  ? await getPresignedUrl(sub.file, 60 * 60 * 24)
                  : null;

                if (sub.subproject_galleries) {
                  sub.subproject_galleries = await Promise.all(
                    sub.subproject_galleries.map(async (g: any) => ({
                      ...g,
                      image: g.image
                        ? await getPresignedUrl(g.image, 60 * 60 * 24)
                        : null,
                    }))
                  );
                }

                return sub;
              })
            );
          }

          if (projectData.project_gallery) {
            projectData.project_gallery = await Promise.all(
              projectData.project_gallery.map(async (g: any) => ({
                ...g,
                image: g.image
                  ? await getPresignedUrl(g.image, 60 * 60 * 24)
                  : null,
              }))
            );
          }

          return projectData;
        })
      );

      const totlaRecords = response.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      successResponse(res, "platter retrieved successfully", {
        data: dataWithUrls,
        
      });
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

