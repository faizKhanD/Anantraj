import { Request, Response, NextFunction } from "express";
import Project from "../../models/project.model";
import { logger } from "../../config/logger.config";
import { successResponse } from "../../utils/responseHandler.util";
import asyncHandler from "express-async-handler";
import {
  ProjectRequestBody,
  ProjectResponseBody,
  ProjectSectionsRequestBody,
} from "../../interfaces/project.interface";
import { ProjectSchema, ProjectSectionsSchema } from "../../validation/admin/project";
import { paginate } from "../../utils/paginate.util";
import { Op } from "sequelize";
import ProjectStatus from "../../models/projectStatus.model";
import Platter from "../../models/platter.model";
import Typology from "../../models/typologies.model";
import SubTypology from "../../models/subtypologies.model";
import { ProjectSecionModel } from "../../models/projects/projectSections.model";
import deleteFileFromS3 from "../../utils/bucket.deleted.file";
import { ProjectSecionModelList } from "../../models/projects/projectSectionsList.model";
import Enquiry from "../../models/enquiri.model";
import { getPresignedUrl } from "../../utils/s3";

interface MulterRequest<T = any> extends Request {
  file?: Express.Multer.File;
  body: T;
}




export const AddProject = asyncHandler(
  async (
    req: MulterRequest<ProjectRequestBody> & { files?: any },
    res: Response<ProjectResponseBody>,
    next: NextFunction
  ) => {
    try {
      const { error } = ProjectSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }

      const files = req.files as {
        image?: Express.MulterS3.File[];
        logo?: Express.MulterS3.File[];
        qr_logo?: Express.MulterS3.File[];
      };

      const {
        name,
        address,
        rera_no,
        alt,
        short_description,
        status,
        meta_title,
        meta_description,
        meta_keywords,
        platterId,
        typologyId,
        subTypologyId,
        projectStatusId,
        link,
      } = req.body;

      const project = await Project.create({
        name,
        address,
        rera_no,
        alt,
        short_description,
        status,
        meta_title,
        meta_description,
        meta_keywords,
        image: files?.image?.[0]?.key || null,
        logo: files?.logo?.[0]?.key || null,
        qr_logo: files?.qr_logo?.[0]?.key || null, // ✅ handle qr_logo file
        platterId,
        typologyId,
        subTypologyId,
        projectStatusId,
        link
      });

      successResponse(res, "Project created successfully", project);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const GetProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { search, statusId } = req.query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { short_description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (statusId) {
      where.projectStatusId = Number(statusId);
    }

    const projects = await Project.findAndCountAll({
      where,

      include: [
        {
          model: ProjectStatus,
          as: "projectstatus",
          attributes: ["id", "name"],
        },
        { model: Platter, as: "platter", attributes: ["id", "name"] },
        { model: Typology, as: "typology", attributes: ["id", "name"] },
        { model: SubTypology, as: "subTypology", attributes: ["id", "name"] },
      ],

      limit,
      offset,
    });

    const rows = await Promise.all(
      projects.rows.map(async (item: any) => {

        item.image = item.image ? await getPresignedUrl(item.image, 60 * 60 * 24) : null; // 24h
        item.qr_logo = item.qr_logo ? await getPresignedUrl(item.qr_logo, 60 * 60 * 24) : null; // 24h
        item.logo = item.logo ? await getPresignedUrl(item.logo, 60 * 60 * 24) : null; // 24h

        return { ...item.toJSON() };
      })
    );

    const totlaRecords = projects.count;
    const totalPages = Math.ceil(totlaRecords / limit);

    res.json({
      message: "",
      success: true,
      data: {
        data: rows,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      },
    });
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
};

export const GetProjectById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        {
          model: ProjectStatus,
          as: "projectstatus",
          attributes: ["id", "name"],
        },
        { model: Platter, as: "platter", attributes: ["id", "name"] },
        { model: Typology, as: "typology", attributes: ["id", "name"] },
        { model: SubTypology, as: "subTypology", attributes: ["id", "name"] },
      ],
    });

    if (!project) {
      return next({ status: 404, message: "Project not found" });
    }

    successResponse(res, "Project retrieved successfully", project);
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
};

export const UpdateProject = asyncHandler(
  async (
    req: Request<{ id: string }> & { files?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const project = await Project.findByPk(id);
      if (!project) {
        return next({ status: 404, message: "Project not found" });
      }

      // Extract uploaded files
      const files = req.files as any;

      // Pick only fields from body that are provided (partial update)
      const updateData: any = {
        ...req.body,
      };

      if (files?.image?.[0]) {
        if (project.image) {
          await deleteFileFromS3(project.image);
        }
        updateData.image = files.image[0].key;
      }

      if (files?.qr_logo?.[0]) {
        if (project.qr_logo) {
          await deleteFileFromS3(project.qr_logo);
        }
        updateData.qr_logo = files.qr_logo[0].key;
      }

      if (files?.logo?.[0]) {
        if (project.logo) {
          await deleteFileFromS3(project.logo);
        }
        updateData.logo = files.logo[0].key;
      }

      await project.update(updateData);

      successResponse(res, "Project updated successfully", project);
    } catch (error: any) {
      logger.error(`Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const DeleteProject = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return next({ status: 404, message: "Project not found" });
    }

    if (project) {

      if (project.qr_logo) {
        await deleteFileFromS3(project.qr_logo);
      }

      if (project.image) {
        await deleteFileFromS3(project.image);
      }

      if (project.image) {
        await deleteFileFromS3(project.image);
      }

    }


    await Project.destroy({ where: { id } });
    successResponse(res, "Project deleted successfully", null);
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
};


export const getAllProjectSectionList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { search, statusId } = req.query;

    const where: any = {};



    const projects = await ProjectSecionModelList.findAndCountAll({});



    const totlaRecords = projects.count;
    const totalPages = Math.ceil(totlaRecords / limit);

    res.json({
      message: "",
      success: true,
      data: {
        data: projects.rows
      },
    });
  } catch (error: any) {
    logger.error(`Database Error: ${error.message}`);
    next(error);
  }
};



export const SaveAndUpdateSecions = asyncHandler(
  async (
    req: MulterRequest<ProjectSectionsRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { error } = ProjectSectionsSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
      const {
        type,
        title,
        description,
        project_id,
        link,
        other,
        sequence
      } = req.body;

      const mobile_file = (req.files as any)?.mobile_file?.[0]?.key || null;
      const desktop_file = (req.files as any)?.desktop_file?.[0]?.key || null;
      const banner: object = {
        mobile_file, desktop_file
      }
      const project = await Project.findByPk(project_id);
      if (!project) {
        return next({
          status: 404,
          message: "Project not found",
        });
      }
      const findRecord = await ProjectSecionModel.findOne({
        where: {
          type: type,
          project_id: project_id
        }
      });
      let otherData: Record<string, any> | null = null;
      if (other) {
        if (typeof other === "string") {
          try {
            otherData = JSON.parse(other);
          } catch (e) {
            throw new Error("Invalid JSON format for 'other'");
          }
        } else if (typeof other === "object") {
          otherData = other; // already parsed JSON
        }
      }

      if (findRecord) {
        const oldBanner = findRecord.banner as { mobile_file?: string; desktop_file?: string } | null;
        if (mobile_file && oldBanner?.mobile_file) {
          await deleteFileFromS3(oldBanner.mobile_file);
        }
        if (desktop_file && oldBanner?.desktop_file) {
          await deleteFileFromS3(oldBanner.desktop_file);
        }
        const data = await findRecord.update({
          title: title ?? null,
          banner,
          description,
          project_id,
          other: otherData,
          sequence,
          status: '1'
        });
        return successResponse(res, `${type} updated successfully`, data);

      } else {
        const data = await ProjectSecionModel.create({
          type,
          title: title ?? null,
          banner,
          other: otherData,
          description,
          project_id,
          sequence,
          status: '1'
        });
        return successResponse(res, `${type} created successfully`, data);
      }

    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getSectionDataByType = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type, project_id } = req.params;
      const sections = await ProjectSecionModel.findOne({
        where: { type: type as string, project_id: project_id as string },
      });

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }

      return successResponse(res, "Success", sections);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);


export const getAllEnquiry = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit, offset, page } = paginate(req.query);
      const { search, statusId } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
        ];
      }
      const enquiry = await Enquiry.findAndCountAll({
        where,
        limit,
        offset,
        order: [['id', 'DESC']]
      });

      const totlaRecords = enquiry.count;
      const totalPages = Math.ceil(totlaRecords / limit);

      return successResponse(res, "Success", {
        data: enquiry.rows,
        pagination: {
          totlaRecords,
          totalPages,
          page: page,
          limit: limit,
        },
      },);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

export const isTownshiPproject = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, type } = req.params;
      const sections = await Project.findByPk(id);

      if (!sections) {
        return next({
          status: 404,
          message: "Page Not Found",
        });
      }
      if (type) {

        sections.is_township = type;
      }
      await sections.save();

      return successResponse(res, "Success", sections);
    } catch (error: any) {
      logger.error(`❌ Database Error: ${error.message}`);
      next(error);
    }
  }
);

