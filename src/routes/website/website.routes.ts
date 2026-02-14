import express from "express";
import {
    getBrandPillars,
    getLeadeShip,
    getSectionType,
    getSinglePageRecord,
    getTestimoidal,
    getPlatterProjects,
    getPlatterData,
    getOurStoryAndManifastro,
    getAllTeamByCategory,
    getTeamByCategory,
    getAllCsrList,
    getAllCsrGalley,
    getAllNews,
    getPlatter,
    getCareerGalleries,
    getJobs,
    saveCareerJobs,
    getAllAwards,
    getAwardGallery,
    getInvestors,
    getOurBlogs,
    getBlogBySlug,
    getPressKit,
    getTownshipAmenities,
    getAllYears,
    getGalleriesProjects,
    getUnderConstructionGallery,
    getTimeline,
    getHomeAwards,
    getProjectGallery,
    getEventGalleries,
    saveEnquiry,
    getProjectBySingleProject,
    getTownshipLocation,
    downloadPressKiteFile,
    getConstructionPlatter,
    getConstructionProjectWithGallery

} from "../../controllers/website/page.controller";
import { getPlatterAndProjectByStatus ,getProjectGalleryListByStatusAndPlatter,getProjects } from "../../controllers/website/project.controller";
import { uploadMiddleware } from "../../utils/upload";
import projectRoutes from  "./project.routes";
import { completeMultipartUpload, startMultipartUpload, uploadPart } from "../../controllers/admins/streamFileUpload.controller";





const websiteRoutes = express();
websiteRoutes.use('/project',projectRoutes);

websiteRoutes.get("/section/:type", getSectionType);
websiteRoutes.get("/our-properties", getProjects);
websiteRoutes.get("/leadership", getLeadeShip);
websiteRoutes.get("/testimonial", getTestimoidal);
websiteRoutes.get("/page/:slug", getSinglePageRecord);
websiteRoutes.get("/brand-pillar", getBrandPillars);

websiteRoutes.get("/all-team-by-categories", getAllTeamByCategory);
websiteRoutes.get("/team/:categories", getTeamByCategory);
websiteRoutes.get("/csr-lists", getAllCsrList);
websiteRoutes.get("/csr-galleries", getAllCsrGalley);
websiteRoutes.get("/get-years/:page", getAllYears);
websiteRoutes.get("/news", getAllNews);
websiteRoutes.get("/platter", getPlatter);
websiteRoutes.get("/get-platterdata/:slug", getPlatterData);

websiteRoutes.get("/getplatter-projects/:slug", getPlatterProjects);
websiteRoutes.get("/get-township-amenities", getTownshipAmenities);
websiteRoutes.get("/get-township-location", getTownshipLocation);

websiteRoutes.get("/project-list/:platter_id", getProjectBySingleProject);

websiteRoutes.get("/career-galleries", getCareerGalleries);
websiteRoutes.get("/jobs", getJobs);
websiteRoutes.post("/job-form",uploadMiddleware.single("file"), saveCareerJobs);
websiteRoutes.get("/awards", getAllAwards);
websiteRoutes.get("/award-gallery/:year", getAwardGallery);
websiteRoutes.get("/our-story-and-manifastro/:type", getOurStoryAndManifastro);
websiteRoutes.get("/investors", getInvestors);
websiteRoutes.get("/blog", getOurBlogs);
websiteRoutes.get("/blog/:slug", getBlogBySlug);
websiteRoutes.get("/press-kit", getPressKit);
websiteRoutes.get("/projects-galleries/:platter_id", getGalleriesProjects);
websiteRoutes.get("/under-construction-gallereis/:year", getUnderConstructionGallery);
websiteRoutes.get("/get-timeline", getTimeline);
websiteRoutes.get("/home-awards", getHomeAwards);
websiteRoutes.get("/get-project-gallery", getProjectGallery);


websiteRoutes.get("/event-galleries/:year", getEventGalleries);
websiteRoutes.get("/get-gallery-platter-and-status", getPlatterAndProjectByStatus);
websiteRoutes.get("/get-gallery-by-platter-and-status/:platter_id/:status", getProjectGalleryListByStatusAndPlatter);


websiteRoutes.get("/download-presskit-file/:id", downloadPressKiteFile);



websiteRoutes.post("/save-enquiry", saveEnquiry);
websiteRoutes.get("/get-all-construction-platters", getConstructionPlatter);

websiteRoutes.get("/getconstruction-project-with-gallery/:platter_id", getConstructionProjectWithGallery);





// websiteRoutes.get("/readstream/:fileId", streamUploadProgress);


websiteRoutes.post("/start-upload", startMultipartUpload);
websiteRoutes.put("/upload-part", uploadPart);
websiteRoutes.post("/complete-upload", completeMultipartUpload);




// careerGalleries
export default websiteRoutes;
