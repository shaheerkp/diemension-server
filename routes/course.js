import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import {
  create,
  readCourse,
  removeImage,
  uploadImage,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  course,
  read,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment,
  userCourses,
  markCompleted,
  listCompleted,
  listIncomplete
} from "../controllers/course.js";
import { isEnrolled, isInstructor, requireSignin } from "../middlewares/index.js";



router.get("/courses",course)

router.post("/course/upload-image", requireSignin, uploadImage);

router.post("/course/remove-image", requireSignin, removeImage);

router.post("/course", requireSignin, isInstructor, create);

router.put("/course/:slug", requireSignin, isInstructor, update);

router.get("/user/course/:slug",requireSignin,isEnrolled,read)

router.get("/course/:slug", readCourse);

router.post("/course/video-upload/:instructorId", requireSignin, uploadVideo);

router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);


router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);

router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get('/check-enrollment/:courseId',requireSignin,checkEnrollment)

router.post('/free-enrollment/:courseId',requireSignin,freeEnrollment)

router.post('/paid-enrollment/:courseId',requireSignin,paidEnrollment)

router.get('/user-courses',requireSignin,userCourses)


router.post('/mark-completed',requireSignin,markCompleted)

router.post('/list-completed',requireSignin,listCompleted)

router.post('/list-incompleted',requireSignin,listIncomplete)

module.exports = router;
