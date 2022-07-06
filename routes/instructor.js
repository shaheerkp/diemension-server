import express from "express";
const router=express.Router();
import { currentInstructor, getAccountStatus, instructorCourses, makeInstructor } from "../controllers/instructor"
import { requireSignin } from "../middlewares/index.js";

router.post("/make-instructor",requireSignin,makeInstructor)
router.post("/get-account-status",requireSignin,getAccountStatus)
router.post("/current-instructor",requireSignin,currentInstructor)

router.get("/instructor-courses",requireSignin,instructorCourses)
      
 

module.exports = router