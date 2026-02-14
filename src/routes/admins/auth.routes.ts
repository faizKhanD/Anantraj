import express, { Application } from "express";
import { loginAdmin, registerAdmin } from "../../controllers/admins/admin.controller";

const router = express.Router();
// middleware 

// routes 
router.post("/register",registerAdmin);
router.post("/login",loginAdmin);
// routes 
export {router as adminAuthRoute}