import express from "express";
import {
  authenticate,
  authorize,
} from "../../middleware/admin.authenticate.middleware";
import { blogRouter } from "./blog.routes";
import platterRoutes from "../../routes/admins/platter.routes";
import newsRoutes from "../../routes/admins/news.routes";
import timelineRoutes from "../../routes/admins/timeline.routes";
import brandpillarRoutes from "../../routes/admins/brandpillar.routes";
import OurteamRoutes from "../../routes/admins/ourteam.routes";
import testimonialsRoutes from "../../routes/admins/testimonials.routes";
import typologyRoutes from "./typologies.routes";
import SubtypologyRoutes from "./subtypologies.routes";
import projectStatusRoutes from "./projectstatus.routes";
import projectRoutes from "./project.routes";
import { PageRoutes } from "./pages.routes";
import { awardRouter } from "./award.routes";
import { OtherSectionsRoutes } from "./otherSections.routes";
import { WebsiteSectionsModel } from "../../models/websiteSections.model";
import { successResponse } from "../../utils/responseHandler.util";
import {investorRouter} from "./investor.routes";
import {csrRouter} from "./csr.routes";
import csrgalleriesRouter from "./csrGalleries.routes";
import careerGalleriesRouter from "./careerGalleries.routes";
import logoRoutes from "./logo.routes";
import { AmenitiesLogoRoutes } from "./amenitiesLogo.routes";
import { jobRoutes } from "./job.routes";
import { PressKit } from "./presskit.routes";
import { OurStoryAndManifastoRouter } from "./ourStoryAndManifasto.routes";
import { InvestorsRoutes } from "./investors.routes";
import { townshipAmenitiesRoutes } from "./township-amenities.routes";
import { TownshipLocationRoutes } from "./township-location.routes";
import { eventGalleriesRoutes } from "./eventGalleries.routes";
import { getAllEnquiry,isTownshiPproject } from "../../controllers/admins/project.controller";
import { constructionUpdateProjectsRoutes } from "./construction_update_projects.routes";
import { constructionUpdateSubProjectsRoutes } from "./construction_update_sub_projects.routes";
import { constructionUpdateProjectsGalleryRoutes } from './construction_update_projects._galleryroutes';
import { blogfaqRouter } from "./blogfaq.routes";




const adminRoutes = express();

adminRoutes.use(authenticate);
adminRoutes.use("/blog", blogRouter);
adminRoutes.use("/blogfaq", blogfaqRouter);
adminRoutes.use("/platter", platterRoutes);
adminRoutes.use("/news", newsRoutes);
adminRoutes.use("/timeline", timelineRoutes);
adminRoutes.use("/brandpillar", brandpillarRoutes);
adminRoutes.use("/team", OurteamRoutes);
adminRoutes.use("/testimonial", testimonialsRoutes);
adminRoutes.use("/typologies", typologyRoutes);
adminRoutes.use("/sub-typologies", SubtypologyRoutes);
adminRoutes.use("/project-statuses", projectStatusRoutes);
adminRoutes.use("/projects", projectRoutes);
adminRoutes.use("/page", PageRoutes);
adminRoutes.use("/award", awardRouter);
adminRoutes.use("/other-sections", OtherSectionsRoutes);
adminRoutes.use("/investor", investorRouter);
adminRoutes.use("/csr-list", csrRouter);
adminRoutes.use("/csr-galleries", csrgalleriesRouter);
adminRoutes.use("/event-galleries", eventGalleriesRoutes);
adminRoutes.use("/career-galleries", careerGalleriesRouter);
adminRoutes.use("/logos", logoRoutes);
adminRoutes.use("/amenities-logo", AmenitiesLogoRoutes);
adminRoutes.use("/jobs", jobRoutes);
adminRoutes.use("/presskit", PressKit);
adminRoutes.use("/our-story-and-manifasto", OurStoryAndManifastoRouter);

adminRoutes.use("/investors", InvestorsRoutes);
adminRoutes.use("/township-location", TownshipLocationRoutes);
adminRoutes.use("/township-amenities", townshipAmenitiesRoutes);
adminRoutes.use("/construction-update-projects", constructionUpdateProjectsRoutes);
adminRoutes.use("/construction-update-sub-projects", constructionUpdateSubProjectsRoutes);
adminRoutes.use("/construction-update-projects-gallery", constructionUpdateProjectsGalleryRoutes);






adminRoutes.get('/get-other-section-list',async (req,res)=>{
  const data =await WebsiteSectionsModel.findAll();
    return successResponse(res,"success",data)
})



adminRoutes.get('/get-all-enquiry',getAllEnquiry);




adminRoutes.post("/is_township/:id/:type", isTownshiPproject);
export default adminRoutes;
